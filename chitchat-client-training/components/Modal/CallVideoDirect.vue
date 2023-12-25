<script setup lang="js">
import { VueFinalModal } from 'vue-final-modal';
import { servers } from '@/constants/constants'
import { io as sio } from 'socket.io-client';
import IconHome from '@/assets/images/file-icons/call.svg';
import getFormattedTimestamp from '@/helpers/getFormattedTimestamp';
import useApi from '@/plugins/api';

const emit = defineEmits(['confirm']);

const { $callVideo } = useNuxtApp();
const { data } = useAuth();
const runtimeConfig = useRuntimeConfig();
const ws_url = runtimeConfig.public.websocket;
const $socket = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });
const $api = useApi();
const router = useRouter();

const local_stream = ref();
const remote_stream = ref({});
const channel = ref();
const peer_connections = ref({});
const user_email = data?.value?.user?.email;
const user_remote = ref();
const room_id = window.location.search.split('=')[1];

// $callVideo.$on('feature:callVideo', (data) => {
//   console.log(data)
//   room_id.value = data;
// })

const constraints = {
  video: true,
  // audio: true,
};

const validateUser = (email, room_id) => {
  $api.chatroom.getChatroomById(room_id).then((data) => {
    if (!data.data.members.includes(email)) router.push('/join-room');
  })
}

const makeCall = async () => {
  console.log(room_id);
  await createChannel(room_id);
  /**
   * Socket listening event
   */
  $socket.on('member_joined', data => handleUserJoined(JSON.parse(data.text)));
  $socket.on('member_left', data => handleUserLeft(JSON.parse(data.text)));
  $socket.on('message_from_peer', data => handleMessageFromPeer(JSON.parse(data.text)));

  local_stream.value = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById('local_video').srcObject = local_stream.value;

  if (!user_email || !channel.value?.room_id) return;
  $socket.emit('member_joined', {
    text: JSON.stringify({ 'email': user_email, 'room_id': channel.value?.room_id })
  });

  $socket.emit('call_request', {
    text: JSON.stringify({ 'user_remote': user_remote })
  });
};
onMounted(() => {
makeCall();

})
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
    if(peer_connections.value[user_email]) {
      peer_connections.value[user_email].addIceCandidate(data.candidate)
    }
  }
}

const createOffer = async (data) => {
  await createPeerConnection(data);

  try {
    let offer = await peer_connections.value[user_email].createOffer();
    await peer_connections.value[user_email].setLocalDescription(offer);

    $socket.emit('message_from_peer', {
      text: JSON.stringify({ 'email': user_email, 'room_id': data.room_id, 'type': 'offer', 'offer': offer, 'channel': data.channel })
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
};

const createAnswer = async (data) => {
  await createPeerConnection(data);

  try {
    await peer_connections.value[user_email].setRemoteDescription(data.offer);

    const answer = await peer_connections.value[user_email].createAnswer();
    await peer_connections.value[user_email].setLocalDescription(answer);

    $socket.emit('message_from_peer', {
      text: JSON.stringify({ 'email': user_email, 'room_id': data.room_id, 'type': 'answer', 'answer': answer, 'channel': data.channel })
    });
  } catch (error) {
    console.error('Error creating answer:', error);
  }
}

const createPeerConnection = async (data) => {
  peer_connections.value[user_email] = new RTCPeerConnection(servers);

  // Create and set MediaStream for remote user
  data.channel.participants.forEach(participant => {
    if (!peer_connections.value[participant]) {
      peer_connections.value[participant] = new RTCPeerConnection(servers);
    }

    if (participant.includes(user_email) || remote_stream.value[participant]) return;

    remote_stream.value[participant] = new MediaStream();

    if (!user_email.includes(participant)) {
      document.getElementById(participant).srcObject = remote_stream.value[participant];
    }

    peer_connections.value[user_email].ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote_stream.value[participant].addTrack(track)
      })
    }
  })


  if(!local_stream.value) {
    local_stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('local_video').srcObject = local_stream.value;
  }

  local_stream.value.getTracks().forEach((track) => {
    peer_connections.value[user_email].addTrack(track, local_stream.value)
  })

  console.log(peer_connections.value);
  console.log(remote_stream.value);

  peer_connections.value[user_email].onicecandidate = async (event) => {
    if(event.candidate) {
      $socket.emit('message_from_peer', {
        text: JSON.stringify({ 'email': user_email, 'room_id': data.room_id, 'type': 'candidate', 'candidate': event.candidate })
      })
    }
  }
}

const addAnswer = async (data) => {
  if (!peer_connections.value[user_email].currentRemoteDescription) {
    console.log(user_email + ' set answer from' + ' - ' + data.email);
    peer_connections.value[user_email].setRemoteDescription(data.answer);
  }
};

const toggleCamera = async () => {
  const videoTrack = local_stream.value.getTracks().find(track => track.kind === 'video')

  if(videoTrack.enabled){
    videoTrack.enabled = false
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  }else{
    videoTrack.enabled = true
    document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}

const toggleMic = async () => {
  const audioTrack = local_stream.value.getTracks().find(track => track.kind === 'audio')

  if (audioTrack.enabled) {
    audioTrack.enabled = false
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
  } else {
    audioTrack.enabled = true
    document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}

async function createChannel(room_id) {
  if (!room_id) return;
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

const leaveChannel = async (email, room_id) => {
  $socket.emit('member_left', {
    text: JSON.stringify({ 'email': email, 'room_id': room_id })
  });
  closeMediaStream(local_stream.value);
  router.push('/')
  emit('confirm');
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

function closeMediaStream(stream) {
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
}

// onBeforeUnmount(() => leaveChannel(user_email, room_id));
</script>

<template>
  <VueFinalModal class="flexCenter">
    <section class="flexCenter w-screen h-screen">
      <div class="relative w-[75%] h-[94%] bg-black">
        <!-- <div class="absolute top-10 left-10 flexBetween w-full h-[120px]">
          <div class="flexCenter gap-[-20px] w-fit h-fit">
            <div v-for="(member, index) in members" :key="index" class="w-[50px] h-[50px] rounded-full">
              <NuxtImg :src="member?.avatar ? member.avatar : '/default-avata.webp'" class="w-full h-full" />
            </div>
          </div>

          <div class="flexCenter w-fit h-full">
            <span>00:00:00</span>
          </div>
        </div> -->

        <div id="videos" class="w-full h-full transition-all duration-300 ease-out">
          <video
            id="local_video"
            autoplay
            playsinline
            class="w-full h-full object-cover"
            :class="peer_connections[user_email] ? 'video_fixed' : 'video_screen'"
          ></video>
          <div
            id="remote_videos"
            class="video_fixed grid lg:grid-cols-4 gap-4 md:grid-cols-3 xs:grid-cols-2 h-[200px] transition-all duration-300 ease-out"
          >
            <video
              id="remote_video"
              autoplay
              playsinline
              class="w-full h-full bg-black"
              :class="peer_connections[user_email] ? 'video_screen block' : 'video_fixed hidden'"
            ></video>
          </div>
        </div>

        <div class="w-full h-fit absolute bottom-20 left-0">
          <div class="flexCenter gap-10 h-fit w-full">
            <button class="flexCenter w-[42px] h-[42px] rounded-full bg-white hover:opacity-75">
              <Icon name="ph:pause-light" class="text-black" />
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

            <button class="flexCenter w-[42px] h-[42px] rounded-full bg-white hover:opacity-75">
              <Icon name="heroicons:microphone-solid" class="text-black" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </VueFinalModal>
</template>

<style scoped>
.video_screen {
  height: 100%;
  width: 100%;
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
