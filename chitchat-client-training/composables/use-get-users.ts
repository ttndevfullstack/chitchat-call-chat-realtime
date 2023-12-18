import useApi from '@/plugins/api';
import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';

export default function useGetUsers(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['users', params],
    () => {
      return $api.user.getAllUser();
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const users = computed(() => query.data.value?.data || []);

  return {
    ...query,
    users,
  };
}
