import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NuxtAuthHandler } from '#auth';
import { BaseResponse } from '@/types/base-response';

export default NuxtAuthHandler({
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NUXT_SECRET,
  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '(hint: jsmith)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' },
      },
      async authorize(credentials: any) {
        try {
          const runtimeConfig = useRuntimeConfig();
          const { data: res } = await axios.post<BaseResponse>(
            runtimeConfig.public.apiBase + '/auth/login',
            credentials,
          );

          // If no error and we have user data, return it
          if (res.success && res.data?.user) {
            return {
              ...res.data?.user,
              id: res.data?.user?._id,
              username: res.data?.user?.username,
              email: res.data?.user?.email,
              avatar: res.data?.user?.avatar,
              role: res.data?.user?.role,
              status: res.data?.user?.status,
              access_token: res.access_token,
            };
          }
          // Return null if user data could not be retrieved
          return null;
        } catch (e) {
          throw createError({
            statusCode: 403,
            statusMessage: 'Credentials not working',
          });
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, trigger, user }) => {
      if (user) {
        token.id = user ? (user as any).id : '';
        token.username = user ? (user as any).username : '';
        token.email = user ? (user as any).email : '';
        token.avatar = user ? (user as any).avatar : '';
        token.role = user ? (user as any).role || [] : [];
        token.friends = user ? (user as any).friends || [] : [];
        token.status = user ? (user as any).status || [] : [];
        token.jwt = user ? (user as any).access_token || '' : '';
      }
      return Promise.resolve(token);
    },
    session: ({ session, token }) => {
      (session as any).id = token.id;
      (session as any).username = token.username;
      (session as any).email = token.email;
      (session as any).avatar = token.avatar;
      (session as any).role = token.role;
      (session as any).friends = token.friends;
      (session as any).status = token.status;
      (session as any).chatroom_ids = token.chatroom_ids;
      (session as any).jwt = token.jwt;
      return Promise.resolve(session);
    },
  },
});
