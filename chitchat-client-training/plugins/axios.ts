import axios from 'axios';
import { stringify } from 'qs';

const useAxiosClient = () => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.apiBase;

  const client = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    // withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    const { data }: { data: any } = useAuth();
    const token = data.value?.jwt;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.paramsSerializer = (params) => stringify(params, { encode: false, arrayFormat: 'comma' });

    return config;
  });

  return client;
};

export default useAxiosClient;
