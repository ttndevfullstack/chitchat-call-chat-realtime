/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--system_primary_color)',
        white: 'var(--system_white_color)',
        black: 'var(--system_black_color)',
        accent: 'var(--system_accent_color)',
        warn: 'var(--system_warn_color)',
        error: 'var(--system_error_color)',
        btn_primary: 'var(--button_primary_color)',
        btn_secondary: 'var(--button_secondary_color)',
      },
      backgroundColor: {
        btn_primary: 'var(--btn_primary_bg)',
        button_secondary: 'var(--button_secondary_bg)',
        nav_default: 'var(--nav_default_bg)',
        sidebar_default: 'var(--sidebar_default_bg)',
        chatroom_default: 'var(--chatroom_default_bg)',
        message_send: 'var(--message_send_bg)',
        message_come: 'var(--message_come_bg)',
        feature_default: 'var(--feature_default_bg)',
        button_hover: 'var(--button_hover_bg)',
      },
      width: {
        button: 'var(--button_default_width)',
        feature: 'var(--feature_default_width)',
        nav: 'var(--nav_default_width)',
      },
      height: {
        button: 'var(--button_default_height)',
      },
      textColor: {
        title: 'var(--system_title_color)',
        text: 'var(--system_text_color)',
      },
      screens: {
        xs: '0px',
        xs: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
        xxl: '2560px',
      },
    },
  },
  plugins: [],
};
