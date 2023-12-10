import type { Config } from './config.interface';
import * as process from 'process';

const config: Config = {
  nest: {
    port: 5001,
    prefix: '/api',
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Chitchat training service',
    description: 'The Chatchit API for call video and chat realtime',
    version: '1.0',
    path: 'documentation',
    server: '/training',
  },
  security: {
    expiresIn: '15d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
  },
  mail: {
    mailHost: process.env.MAIL_HOST,
    mailPort: parseInt(process.env.MAIL_PORT),
    authEmailUser: process.env.AUTH_MAIL_USER,
    authEmailPassword: process.env.AUTH_MAIL_PASSWORD,
    mailFrom: process.env.MAIL_FROM,
  },
};

export default (): Config => config;
