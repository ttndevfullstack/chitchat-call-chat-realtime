import useApi from '@/plugins/api';
import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';

export default function useGetMembers(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['members', params],
    () => {
      if (!params?.value?.chatroom_id) return;
      const chatroom_id = params?.value?.chatroom_id;
      return $api.chatroom.getAllMember(chatroom_id);
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const members = computed(() => query.data.value?.data || []);

  return {
    ...query,
    members,
  };
}
