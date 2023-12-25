import { io as sio, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  const { data }: { data: any } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  const ws_url = runtimeConfig.public.websocket;

  socket = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });

  socket.on('connect', () => {
    console.log('Socket connected', socket?.id);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket?.id);
  });

  return socket;
};
initializeSocket();

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket has not been initialized.');
  }
  return socket;
};
