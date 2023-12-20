import useApi from '@/plugins/api';
import { useQuery } from 'vue-query';
import type { UnwrapRef } from 'vue';

export default function useGetUser(params?: UnwrapRef<any>, options?: any) {
  const $api = useApi();
  const query = useQuery(
    ['user', params],
    () => {
      const { email } = params.value;
      return $api.user.getUser(email);
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const user = computed(() => query.data.value?.data || []);

  return {
    ...query,
    user,
  };
}
