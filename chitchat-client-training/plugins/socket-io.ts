import { io as sio } from 'socket.io-client';

const useSocketIO = () => {
  const { data }: { data: any } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  const ws_url = runtimeConfig.public.websocket;

  const io = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });

  return io;
};

export default useSocketIO;
