<script lang="js" setup>
import { io as sio } from 'socket.io-client';
import { servers } from '@/constants/constants'
import useApi from '@/plugins/api';
import getFormattedTimestamp from '@/helpers/getFormattedTimestamp';

const { data } = useAuth();
const $api = useApi();
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const ws_url = runtimeConfig.public.websocket;
const io = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });

let localStream;
const remoteStream = ref({});
const channel = ref();
const peerConnections = ref({});
const user_email = data?.value?.user?.email;
const room_id = route?.params?.id;

const constraints = {
  video: true,
  // audio: true,
};

const validateUser = (email, room_id) => {
  $api.chatroom.getChatroomById(room_id).then((data) => {
    if (!data.data.members.includes(email)) router.push('/join-room');
  })
}

const createChannel = async () => {
  const new_channel = {
    room_id,
    status: 'active',
    time_start: getFormattedTimestamp().toString(),
    participants: [],
  };

  await $api.channel.createChannel(new_channel).then((data) => {
    if (!data?.success) {
      alert('Create channel fail!');
      router.push('/');
    }
    channel.value = data?.data;
  })
}

const makeCall = async () => {
  // await validateUser(user_email, room_id);
  await createChannel();

  io.on('member_joined', data => handleUserJoined(JSON.parse(data.text)));
  io.on('member_left', data => handleUserLeft(JSON.parse(data.text)));
  io.on('message_from_peer', data => handleMessageFromPeer(JSON.parse(data.text)));

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById('local_video').srcObject = localStream;

  if (!user_email || !channel.value?.room_id) return;
  io.emit('member_joined', {
    text: JSON.stringify({ 'email': user_email, 'room_id': channel.value?.room_id })
  });
};
makeCall();

const handleUserJoined = async (data) => {
  console.log(data.email + ' joined to channel');

  // Create video element for each User
  data?.channel?.participants?.forEach(participant => {
    if (!document.getElementById(participant)) {
      createVideoElement(participant);
    }
  })

  // If User is joined not create offer
  if (channel.value?.participants.includes(user_email)) return;
  channel.value = data.channel;
  createOffer(data);
};

const handleUserLeft = (data) => {
  if (document.getElementById(data.email)) {
    document.getElementById(data.email).remove();
  }
  console.log(data.email + ' left the channel');
}

const handleMessageFromPeer = async (data) => {
  console.log(data.email + ' - ' + data.type);

  if(data?.type === 'offer') {
    if (user_email.includes(data.email)) return;
    createAnswer(data)
  }

  if(data?.type === 'answer') {
    // If is user create this answer and answer is added => return
    if (user_email.includes(data.email)) return;
    await addAnswer(data);
  }

  if(data?.type === 'candidate') {
    if (user_email.includes(data.email)) return;
    if(peerConnections.value[user_email]) {
      peerConnections.value[user_email].addIceCandidate(data.candidate)
    }
  }
}

const createOffer = async (data) => {
  await createPeerConnection(data);

  try {
    let offer = await peerConnections.value[user_email].createOffer();
    await peerConnections.value[user_email].setLocalDescription(offer);

    io.emit('message_from_peer', {
      text: JSON.stringify({ 'email': user_email, 'room_id': data.room_id, 'type': 'offer', 'offer': offer, 'channel': data.channel })
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
};

const createAnswer = async (data) => {
  await createPeerConnection(data);

  try {
    await peerConnections.value[user_email].setRemoteDescription(data.offer);

    const answer = await peerConnections.value[user_email].createAnswer();
    await peerConnections.value[user_email].setLocalDescription(answer);

    io.emit('message_from_peer', {
      text: JSON.stringify({ 'email': user_email, 'room_id': data.room_id, 'type': 'answer', 'answer': answer, 'channel': data.channel })
    });
  } catch (error) {
    console.error('Error creating answer:', error);
  }
}

const createPeerConnection = async (data) => {
  peerConnections.value[user_email] = new RTCPeerConnection(servers);

  // Create and set MediaStream for remote user
  data.channel.participants.forEach(participant => {
    if (!peerConnections.value[participant]) {
      peerConnections.value[participant] = new RTCPeerConnection(servers);
    }

    if (participant.includes(user_email) || remoteStream.value[participant]) return;

    remoteStream.value[participant] = new MediaStream();

    if (!user_email.includes(participant)) {
      document.getElementById(participant).srcObject = remoteStream.value[participant];
    }
  })

  peerConnections.value[user_email].ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.value[participant].addTrack(track)
    })
  }

  if(!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('local_video').srcObject = localStream;
  }

  localStream.getTracks().forEach((track) => {
    peerConnections.value[user_email].addTrack(track, localStream)
  })

  peerConnections.value[user_email].onicecandidate = async (event) => {
    if(event.candidate) {
      io.emit('message_from_peer', {
        text: JSON.stringify({ 'email': user_email, 'room_id': data.room_id, 'type': 'candidate', 'candidate': event.candidate })
      })
    }
  }
}

const addAnswer = async (data) => {
  if (!peerConnections.value[user_email].currentRemoteDescription) {
    console.log(user_email + ' set answer from' + ' - ' + data.email);
    peerConnections.value[user_email].setRemoteDescription(data.answer);
  }
};

const toggleCamera = async () => {
  const videoTrack = localStream.getTracks().find(track => track.kind === 'video')

  if(videoTrack.enabled){
    videoTrack.enabled = false
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  }else{
    videoTrack.enabled = true
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}

const toggleMic = async () => {
  const audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

  if (audioTrack.enabled) {
    audioTrack.enabled = false
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  } else {
    audioTrack.enabled = true
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}

const leaveChannel = async (email, room_id) => {
  io.emit('member_left', {
    text: JSON.stringify({ 'email': email, 'room_id': room_id })
  });
  router.push('/');
}

const createVideoElement = (email) => {
  if (user_email.includes(email)) return;
  const remote_videos = document.getElementById('remote_videos');
  const remote_video = document.createElement('video');

  remote_video.setAttribute('id', email);
  remote_video.setAttribute('class', 'remote_video');
  remote_video.autoplay = true;
  remote_video.playsinline = true;
  remote_videos.appendChild(remote_video);
};

onBeforeUnmount(() => leaveChannel(user_email, room_id));
</script>

<template>
  <div class="w-full h-screen">
    <div id="videos">
      <video id="local_video" class="w-full h-full" autoplay playsinline></video>
      <div
        id="remote_videos"
        class="fixed top-10 left-10 grid lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 h-[200px]"
      ></div>
    </div>

    <div id="controls">
      <div class="control-container camera-btn" @click="toggleCamera">
        <Icon name="material-symbols:android-camera" size="30px" />
      </div>

      <div class="control-container micro-btn" @click="toggleMic">
        <Icon name="mdi:microphone" size="30px" />
      </div>

      <div class="control-container leave-btn" @click="leaveChannel(user_email, room_id)">
        <Icon name="material-symbols:call" size="30px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#videos {
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.remote_video {
  background-color: black;
  width: 100%;
  height: 100%;
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  border: 2px solid #b366f9;
  -webkit-box-shadow: 3px 3px 15px -1px rgba(0, 0, 0, 0.77);
  box-shadow: 3px 3px 15px -1px rgba(0, 0, 0, 0.77);
  z-index: 999;
}

#controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2em;
}

.control-container {
  background-color: rgb(179, 102, 249, 0.9);
  padding: 14px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.control-container img {
  height: 20px;
  width: 20px;
}

.micro-btn {
  background-color: white;
}

.camera-btn {
  background-color: white;
}

.leave-btn {
  background-color: var(--system_error_color);
}

.micro-btn:hover,
.camera-btn:hover,
.leave-btn:hover {
  opacity: 0.7;
}
</style>
