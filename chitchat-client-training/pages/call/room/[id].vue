<script lang="js" setup>
import { io as sio } from 'socket.io-client';
import { servers } from '@/constants/constants';
import IconHome from '@/assets/images/file-icons/call.svg';
import getFormattedTimestamp from '@/helpers/getFormattedTimestamp';
import useApi from '@/plugins/api';

const { data, getSession } = useAuth();
const session = await getSession();
const $api = useApi();
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const ws_url = runtimeConfig.public.websocket;
const io = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });
const call_setting = ref({
  camera: true,
  micro: true,
});

let localStream;
const remoteStream = ref({});
const channel = ref();
const peerConnections = ref({});
const user_remote = ref();
const user_email = data?.value?.user?.email;
const room_id = route?.params?.id;
const offer_sended = ref([]);

const constraints = {
  video: true,
  // audio: true,
};

const makeCall = async () => {
  await validateUser(user_email, room_id);
  await createChannel(room_id);

  io.on('member_joined', data => handleUserJoined(JSON.parse(data.text)));
  io.on('member_left', data => handleUserLeft(JSON.parse(data.text)));
  io.on('message_from_peer', data => handleMessageFromPeer(JSON.parse(data.text)));

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById('local_video').srcObject = localStream;

  if (!user_email || !channel.value?.room_id) return;
  if (channel.value?.participants.includes(user_email)) return;

  io.emit('member_joined', {
    text: JSON.stringify({ 'email': user_email, 'room_id': channel.value?.room_id })
  });
};
makeCall();

const handleUserJoined = async (data) => {
  console.log(data.email + ' joined to channel');

  // Create video element for each User
  data?.channel?.participants?.forEach(participant => {
    if (participant.includes(user_email)) return;
    if (!document.getElementById(participant)) {
      createVideoElement(participant);
    }
  })

  // If User is joined not create offer
  if (channel.value?.participants.includes(user_email)) return;
  channel.value = data.channel;

  if (channel.value.participants.length < 2) {
    io.emit('call_request', {
      text: JSON.stringify({ 'call_from': { email: user_email, avatar: session.avatar, room_id }, 'call_to': user_remote.value })
    });
  }

  if (channel.value.participants.length >= 2) {
    console.log(offer_sended.value);
    if (offer_sended.value?.includes(data.email)) return;
    createOffer(data);
  }
};

const handleUserLeft = (data) => {
  if (document.getElementById(data.email)) {
    document.getElementById(data.email).remove();
  }
  console.log(data.email + ' left the channel');
}

const handleMessageFromPeer = async (data) => {
  if (data.email.includes(user_email)) {
    console.log(data.email + ' - ' + data.type);
  }

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
    offer_sended.value = [...offer_sended.value, data.email];
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

    peerConnections.value[user_email].ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.value[participant].addTrack(track)
      })
    }
  })


  if(!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('local_video').srcObject = localStream;
  }

  localStream.getTracks().forEach((track) => {
    peerConnections.value[user_email].addTrack(track, localStream)
  })

  console.log(peerConnections.value);
  console.log(remoteStream.value);

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
    call_setting.value.camera = false;
  }else{
    videoTrack.enabled = true
    call_setting.value.camera = true;
  }
}

const toggleMic = async () => {
  const audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

  if (audioTrack.enabled) {
    audioTrack.enabled = false
    call_setting.value.micro = false;
  } else {
    audioTrack.enabled = true
    call_setting.value.micro = true;
  }
}

const leaveChannel = async (email, room_id) => {
  io.emit('member_left', {
    text: JSON.stringify({ 'email': email, 'room_id': room_id })
  });
  closeMediaStream(localStream);
  router.push('/');
}

async function createChannel(room_id) {
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

async function createVideoElement(email) {
  if (user_email.includes(email)) return;
  const remote_videos = document.getElementById('remote_videos');
  const remote_video = document.createElement('video');

  remote_video.setAttribute('id', email);
  remote_video.setAttribute('class', 'video_screen');
  remote_video.setAttribute('style', 'width: 100%; height: 100%; object-fit: cover;');
  remote_video.autoplay = true;
  remote_video.playsinline = true;
  remote_videos.appendChild(remote_video);
};

function closeMediaStream(stream) {
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
}

function validateUser(email, room_id) {
  $api.chatroom.getChatroomById(room_id).then((data) => {
    data.data.members.forEach(member => {
      if (member.includes(user_email)) return;
      user_remote.value = member;
    })
    if (!data.data.members.includes(email)) router.push('/');
  })
}

onBeforeUnmount(() => leaveChannel(user_email, room_id));
</script>

<template>
  <div class="w-full h-screen">
    <div id="videos" class="w-full h-full transition-all duration-300 ease-out">
      <video
        id="local_video"
        autoplay
        playsinline
        class="w-full h-full object-cover"
        :class="peerConnections[user_email] ? 'video_fixed' : 'video_screen'"
      ></video>
      <div id="remote_videos" class="h-full w-full transition-all duration-300 ease-out"></div>
    </div>

    <div class="w-full h-fit absolute bottom-14 left-0">
      <div class="flexCenter gap-10 h-fit w-full">
        <button
          class="flexCenter w-[50px] h-[50px] rounded-full hover:opacity-75"
          :class="call_setting?.camera ? 'bg-white' : 'bg_transparent border-[2px] border-white'"
          @click="toggleCamera"
        >
          <Icon
            name="material-symbols:android-camera"
            class="text-xl"
            :class="call_setting?.camera ? 'text-black ' : 'text-white'"
          />
        </button>

        <button
          href="javascript:void(0)"
          class="icon-btn btn-danger button-effect btn-xl is-animating"
          @click="leaveChannel(user_email, room_id)"
        >
          <i data-v-4d521fc4="" data-name="phone" data-tags="call" data-type="phone" class="feather feather--phone"
            ><IconHome class="text-xl"
          /></i>
        </button>

        <button
          class="flexCenter w-[50px] h-[50px] rounded-full hover:opacity-75"
          :class="call_setting?.micro ? 'bg-white' : 'bg_transparent border-[2px] border-white'"
          @click="toggleMic"
        >
          <Icon
            name="heroicons:microphone-solid"
            class="text-xl"
            :class="call_setting?.micro ? 'text-black ' : 'text-white'"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg_transparent {
  background-color: transparent !important;
}

.video_screen {
  height: 100% !important;
  width: 100% !important;
  object-fit: cover;
}

#remote_video {
  height: 100% !important;
  width: 100% !important;
  object-fit: cover;
}

.video_fixed {
  position: absolute;
  bottom: 20px;
  left: 20px;
  height: 250px;
  width: 200px;
}

.btn-danger.is-animating {
  box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
}

.is-animating.btn-danger {
  animation: phone-outer-danger 3s infinite;
}

.is-animating:before {
  animation: phone-inner 3s infinite;
  background-color: hsla(0, 0%, 100%, 0.2);
  border-radius: 100%;
  content: '';
  height: 60px;
  left: 0;
  opacity: 1;
  position: absolute;
  top: 0;
  transform: translateZ(0) scale(0);
  width: 60px;
}

.icon-btn.btn-xl {
  height: 60px;
  padding: 18px;
  width: 60px;
}

.is-animating {
  transform: translateZ(0) scale(1);
}

.button-effect {
  display: inline-flex;
  overflow: hidden;
  position: relative;
}

.icon-btn:hover {
  background-color: #f72900;
}

.icon-btn {
  align-items: center;
  border: 0 !important;
  border-radius: 100%;
  display: inline-flex;
  font-weight: 800;
  height: 42px;
  justify-content: center;
  width: 42px;
  rotate: calc(135deg);
}

.icon-btn > svg {
  fill: white;
  stroke: white;
}

.btn-danger {
  background-color: #ff4e2b;
  border-color: #ff4e2b !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.button-effect:before {
  background: hsla(0, 0%, 100%, 0.2);
  display: block;
  z-index: 2;
}

@keyframes phone-inner {
  0% {
    opacity: 1;
    transform: translateZ(0) scale(0);
  }

  33.3333% {
    opacity: 1;
    transform: translateZ(0) scale(0.9);
  }
  66.6666% {
    opacity: 0;
    transform: translateZ(0) scale(0);
  }
  100% {
    opacity: 0;
    transform: translateZ(0) scale(0);
  }
}

@keyframes phone-outer-danger {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
  33.3333% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0.9), 0 0.05em 0.1em rgba(0, 0, 0, 0.5);
    transform: translateZ(0) scale(1.1);
  }
  66.6666% {
    box-shadow: 0 0 0 1.2em rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
}
</style>
