import useApi from '@/plugins/api';
import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';

export default function useGetFriends(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['friends', params],
    () => {
      const { email } = params?.value;
      if (!email) return;
      return $api.user.getFriends(email);
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const friends = computed(() => query.data.value?.data || []);

  return {
    ...query,
    friends,
  };
}
