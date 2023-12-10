import { Api } from '@/api';
import type { AxiosInstance } from 'axios';
import useAxiosClient from './axios';

const useApi = () => {
  const axios = useAxiosClient();
  const api = new Api(axios as AxiosInstance);

  return api;
};

export default useApi;
