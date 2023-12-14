import {
  createChannel,
  route,
  io,
  handleUserJoined,
  handleUserLeft,
  handleMessageFromPeer,
  localStream,
  constraints,
  offerCreated,
} from './call-video.vue';

export let init = async () => {
  console.log('init');
  createChannel(route.params.id, data.value.user.email);

  io.on('member_joined', (data) => handleUserJoined(data));
  io.on('member_left', (data) => handleUserLeft(data));
  io.on('message_from_peer', (data) => handleMessageFromPeer(data));

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById('user-1').srcObject = localStream;

  const email = data?.value?.user?.email;
  if (!email || offerCreated) return;

  io.emit('member_joined', email);
};
