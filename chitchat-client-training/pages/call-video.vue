<script lang="js" setup>
import useApi from '@/plugins/api';
import { io as sio } from 'socket.io-client';
const { data } = useAuth();

// Connect Socket IO
const runtimeConfig = useRuntimeConfig();
const ws_url = runtimeConfig.public.websocket;
const io = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });

const $api = useApi();

let localStream;
let remoteStream;
let peerConnections = {};
let uid = String(Math.floor(Math.random() * 10000))

const constraints = {
  video: true,
  // audio: true,
};

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

// checkRoomId()

let init = async () => {
  console.log('init');

  io.on('member_joined', data => handleUserJoined(data));
  io.on('member_left', data => handleUserLeft(data));
  io.on('message_from_peer', data => handleMessageFromPeer(data));

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById('user-1').srcObject = localStream;

  const email = data?.value?.user?.email;
  if (!email) console.error('User email not available');

  io.emit('member_joined', uid);
};

let handleUserJoined = async (email) => {
  console.log('A new user join to chatroom:', email);
  await createPeerConnection(email);
  createOffer(email);
};

let handleUserLeft = (email) => {
  if (peerConnections[email]) {
    peerConnections[email].close();
    delete peerConnections[email];
  }
  console.log('User left the channel:', email);
    document.getElementById('user-2').style.display = 'none'
    document.getElementById('user-1').classList.remove('smallFrame')
}

let handleMessageFromPeer = async (data) => {
  const message = JSON.parse(data.text);
  console.log(message)
  if(message?.type === 'offer') {
    createAnswer(message.member_id, message.offer)
  }

  if(message?.type === 'answer') {
    addAnswer(data.member_id, message.answer)
  }

  if(message?.type === 'candidate') {
    if(peerConnections[data.member_id]) {
      peerConnections[data.member_id].addIceCandidate(message.candidate)
    }
  }
}

let createChannel = (id) => {
  const newChannel = {
    createdBy: data?.value?.user?.email,
    members: [data?.value?.user?.email],
  }
  return $api.channel.createChannel(newChannel);
}

let joinChannel = (id, email) => {
  if (!id || !data.value.user.email) return;
  $api.channel.joinChannel(id, email)
}

let createOffer = async (email) => {
  let peerConnection = peerConnections[email];
  if (!peerConnection) {
    await createPeerConnection(email);
    peerConnection = peerConnections[email];
  }

  try {
    let offer = await peerConnection.createOffer();
    await peerConnections[email].setLocalDescription(offer);

    io.emit('message_from_peer', {
      text: JSON.stringify({ 'member_id': email, 'type': 'offer', 'offer': offer })
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
};

let createAnswer = async (email, offer) => {
  if (!peerConnections[email]) {
    await createPeerConnection(email);
  }

  try {
    await peerConnections[email].setRemoteDescription(offer);

    let answer = await peerConnections[email].createAnswer();
    await peerConnections[email].setLocalDescription(answer);

    io.emit('message_from_peer', {
      text: JSON.stringify({ 'member_id': email, 'type':'answer', 'answer': answer })
    });
  } catch (error) {
    console.error('Error creating answer:', error);
  }
}

let createPeerConnection = async (email) => {
  let peerConnection = new RTCPeerConnection(servers);
  peerConnections[email] = peerConnection;

  document.getElementById('user-2').srcObject = remoteStream
  document.getElementById('user-2').style.display = 'block'
  // document.getElementById('user-1').classList.add('smallFrame')

  if(!localStream){
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream
  }

  if (localStream && peerConnections[email]) {
    localStream.getTracks().forEach((track) => {
      peerConnections[email].addTrack(track, localStream);
    });
  }

  peerConnections[email].ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      if (!remoteStream) {
        remoteStream = new MediaStream();
      }
      remoteStream.addTrack(track);
      document.getElementById('user-2').srcObject = remoteStream;
    });
  };

  peerConnections[email].onicecandidate = async (event) => {
    if(event.candidate) {
      io.emit('message_from_peer', {
        text: JSON.stringify({ 'member_id': email , 'type': 'candidate', 'candidate': event.candidate })
      })
    }
  }
}

let addAnswer = async (email, answer) => {
  if (peerConnections[email] && !peerConnections[email].currentRemoteDescription) {
    console.log('setRemoteDescription:', answer);
    peerConnections[email].setRemoteDescription(answer);
  }
};

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

    if(videoTrack.enabled){
        videoTrack.enabled = false
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        videoTrack.enabled = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

let toggleMic = async () => {
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

let leaveChannel = async () => {
    io.emit('member_left', data.value.user.email)
    await io.on('disconnect')
}

let checkRoomId = () => {
  const roomId = 111;
  const urlParams = new URLSearchParams(window.location.search)
  if (roomId !== Number(urlParams.get('room_id'))) return router.push('/john-room')
}

window.addEventListener('beforeunload', leaveChannel)

init();
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
