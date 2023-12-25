import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';
import useApi from '@/plugins/api';

export default function useGetMessages(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['messages', params],
    () => {
      if (!params?.value?.chatroom_id) return;
      const chatroom_id = params?.value?.chatroom_id;
      return $api.message.getMessageInChatroom(chatroom_id);
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const messages = computed(() => query.data.value?.data || []);

  return {
    ...query,
    messages,
  };
}
