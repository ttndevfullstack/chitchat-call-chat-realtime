import type { User } from './common';

export type Error = {
  code: string;
  message: string;
  fields: Record<string, any>;
};

export type TokenResponse = {
  token: string;
  token_type: string;
  expires_at: number;
  user: User;
};
