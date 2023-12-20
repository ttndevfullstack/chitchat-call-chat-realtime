import useApi from '@/plugins/api';
import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';

export default function useGetChatrooms(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['chatrooms', params],
    () => {
      const { email, type } = params.value;
      if (!email || !type) return;
      return $api.chatroom.getAllChatroomByEmail(params?.value);
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const chatrooms = computed(() => query.data.value?.data || []);

  return {
    ...query,
    chatrooms,
  };
}
