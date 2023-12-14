import useApi from '@/plugins/api';
import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';

export default function useGetChatroom(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['chatroom', params],
    () => {
      const { chatroom_id } = params?.value;
      if (!chatroom_id) return;
      return $api.chatroom.getChatroomById(params?.value);
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const chatroom = computed(() => query.data.value?.data || []);

  return {
    ...query,
    chatroom,
  };
}
