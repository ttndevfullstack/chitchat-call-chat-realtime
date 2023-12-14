import { resolve } from 'path';
import { Server } from 'socket.io';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    public: {
      apiBase: process.env.BASE_API_URL,
      origin: process.env.ORIGIN_URL,
      websocket: process.env.SOCKET_URL,
    },
  },

  app: {
    head: {
      title: 'Chitchat - chat messenger everywhere',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, interactive-widget=resizes-content',
        },
      ],
    },
    pageTransition: { name: 'page', type: 'animation' },
    layoutTransition: { name: 'layout', type: 'animation' },
  },

  modules: ['nuxt-socket-io', '@sidebase/nuxt-auth', 'nuxt-icon', "@nuxt/image"],

  // Sidebar Auth Config
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    baseURL: process.env.BASE_API_AUTH,
    provider: {
      type: 'authjs',
    },
  },

  // Socket IO Config
  io: {
    sockets: [
      {
        name: 'main',
        url: process.env.SOCKET_URL,
      },
    ],
  },

  css: [
    resolve('./assets/scss/_variables.scss'),
    resolve('./assets/scss/animations/_transitions.scss'),
    resolve('./assets/scss/app.scss'),
    resolve('./assets/scss/tailwindDefault.scss'),
    'vue-final-modal/style.css',
  ],
});