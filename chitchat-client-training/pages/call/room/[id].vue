<script lang="js" setup>
import { io as sio } from 'socket.io-client';
import { servers } from '@/constants/constants'
import useApi from '@/plugins/api';
import getFormattedTimestamp from '~/helpers/getFormattedTimestamp';

const { data } = useAuth();
const $api = useApi();
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const ws_url = runtimeConfig.public.websocket;
const io = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });

let localStream;
let remoteStream;
const channel = ref();
const peerConnection = ref();
const user_email = data?.value?.user?.email;
const room_id = route?.params?.id;
const uid = ref(String(Math.floor(Math.random() * 1000000)));

const constraints = {
  video: true,
  // audio: true,
};

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
  // validateUser(room_id);
  await createChannel();

  io.on('member_joined', data => handleUserJoined(JSON.parse(data.text)));
  io.on('member_left', data => handleUserLeft(data));
  io.on('message_from_peer', data => handleMessageFromPeer(data));

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById('user-1').srcObject = localStream;

  if (!user_email || !uid.value || !channel.value?.room_id) return;
  io.emit('member_joined', {
    text: JSON.stringify({ 'email': uid.value, 'room_id': channel.value?.room_id })
  });
};
makeCall();

const handleUserJoined = async (data) => {
  console.log(data.email + ' joined to channel');
  if (channel.value?.participants.includes(uid.value)) return;
  console.log(channel.value);
  channel.value = data.channel;
  console.log(channel.value);
  createOffer(data);
};

const handleUserLeft = (email) => {
  console.log('User left the channel:', email);
  document.getElementById('user-2').style.display = 'none'
  document.getElementById('user-1').classList.remove('smallFrame')
}

const handleMessageFromPeer = async (data) => {
  const message = JSON.parse(data.text);
  if(message?.type === 'offer') {
    if (uid.value.includes(message.email)) return;
    createAnswer(message)
  }

  if(message?.type === 'answer') {
    addAnswer(message)
  }

  if(message?.type === 'candidate') {
    if (uid.value.includes(message.email)) return;
    if(peerConnection.value) {
      peerConnection.value.addIceCandidate(message.candidate)
    }
  }
}

const createOffer = async (data) => {
  await createPeerConnection(data);

  try {
    let offer = await peerConnection.value.createOffer();
    await peerConnection.value.setLocalDescription(offer);

    console.log(uid.value + " createOffer:" + offer);
    io.emit('message_from_peer', {
      text: JSON.stringify({ 'email': data.email, 'room_id': data.room_id, 'type': 'offer', 'offer': offer })
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
};

const createAnswer = async (message) => {
  await createPeerConnection(message);

  try {
    await peerConnection.value.setRemoteDescription(message.offer);

    const answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);

    console.log(uid.value + " createAnswer:" + answer);
    io.emit('message_from_peer', {
      text: JSON.stringify({ 'email': message.email, 'room_id': message.room_id, 'type': 'answer', 'answer': answer })
    });
  } catch (error) {
    console.error('Error creating answer:', error);
  }
}

const createPeerConnection = async (message) => {
  peerConnection.value = new RTCPeerConnection(servers);

  remoteStream = new MediaStream()
  document.getElementById('user-2').srcObject = remoteStream
  document.getElementById('user-2').style.display = 'block'
  // document.getElementById('user-1').classList.add('smallFrame')

  if(!localStream){
    localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false })
    document.getElementById('user-1').srcObject = localStream
  }

  localStream.getTracks().forEach((track) => {
    peerConnection.value.addTrack(track, localStream)
  })

  peerConnection.value.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }

  peerConnection.value.onicecandidate = async (event) => {
    if(event.candidate) {
      io.emit('message_from_peer', {
        text: JSON.stringify({ 'email': message.email, 'room_id': message.room_id, 'type': 'candidate', 'candidate': event.candidate })
      })
    }
  }
}

const addAnswer = async (message) => {
  if (!peerConnection.value.currentRemoteDescription) {
    console.log('setRemoteDescription:', message.answer);
    peerConnection.value.setRemoteDescription(message.answer);
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

    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

const leaveChannel = async () => {
  io.emit('member_left', data.value.user.email)
  await io.on('disconnect')
}



const validateUser = (email, room_id) => {
  if (!chatrooms.includes(room_id)) router.push('/join-room');
}

window.addEventListener('beforeunload', leaveChannel)
</script>

<template>
  <div>
    <div id="videos">
      <video class="video-player" id="user-1" autoplay playsinline></video>
      <video class="video-player smallFrame" id="user-2" autoplay playsinline></video>
    </div>

    <div id="controls">
      <div class="control-container" @click="toggleCamera">
        <Icon name="material-symbols:android-camera" size="30px" />
      </div>

      <div class="control-container" @click="toggleMic">
        <Icon name="mdi:microphone" size="30px" />
      </div>

      <a href="lobby.html">
        <div class="control-container" @click="router.push('/')">
          <Icon name="material-symbols:call" size="30px" />
        </div>
      </a>
    </div>
  </div>
</template>

<style>
#videos {
  display: grid;
  grid-template-columns: 1fr;
  height: 100vh;
  overflow: hidden;
}

.video-player {
  background-color: black;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#user-2 {
  display: none;
}

.smallFrame {
  position: fixed;
  top: 20px;
  left: 20px;
  height: 170px;
  width: 300px;
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
  gap: 1em;
}

.control-container {
  background-color: rgb(179, 102, 249, 0.9);
  padding: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.control-container img {
  height: 30px;
  width: 30px;
}

#leave-btn {
  background-color: rgb(255, 80, 80, 1);
}

@media screen and (max-width: 600px) {
  .smallFrame {
    height: 80px;
    width: 120px;
  }

  .control-container img {
    height: 20px;
    width: 20px;
  }
}
</style>
