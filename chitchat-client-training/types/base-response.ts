import type { Error } from './type-response';

export type BaseResponse<T = any> = {
  status: number;
  success: boolean;
  access_token?: string;
  error?: Error;
  data?: T;
};
