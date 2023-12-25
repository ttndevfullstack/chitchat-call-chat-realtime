import { io as sio } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const { data }: { data: any } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  const ws_url = runtimeConfig.public.websocket;
  const socket = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });

  return {
    provide: {
      socket,
    },
  };
});
