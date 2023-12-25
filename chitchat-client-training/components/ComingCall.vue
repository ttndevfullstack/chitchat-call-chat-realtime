<script lang="ts" setup>
import { io as sio } from 'socket.io-client';
import type { ComingCall } from '@/types/common';
import IconHome from '@/assets/images/file-icons/call.svg';

const { data }: any = useAuth();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const ws_url = runtimeConfig.public.websocket;
const io = sio(ws_url, { transports: ['websocket'], query: { token: data?.value?.jwt } });
const user_email = data.value?.user?.email;
const coming_call = ref<ComingCall | null>(null);

onMounted(() => {
  io.on('call_request', (data: any) => {
    const message = JSON.parse(data.text);
    console.log(message);
    if (message.call_to.includes(user_email)) {
      coming_call.value = message.call_from;
      setTimeout(destroyComingCall, 30000);
    }
  });
});

function destroyComingCall() {
  coming_call.value = null;
}
</script>

<template>
  <div
    v-if="coming_call"
    class="fixed top-10 right-10 w-[220px] h-[260px] z-50 shadow-xl transition-all duration-300 ease-out rounded-lg overflow-hidden"
  >
    <div class="relative w-full h-full">
      <NuxtImg
        :src="coming_call?.avatar ? coming_call?.avatar : '/default-avata.webp'"
        class="w-full h-full object-cover"
      />

      <div class="absolute left-0 bottom-4 w-full text-center">
        <h5>{{ coming_call?.email }}</h5>
        <div class="w-full h-fit mt-4">
          <div class="flexBetween px-8 h-fit w-full">
            <button
              href="javascript:void(0)"
              class="icon-btn btn-accent button-effect btn-xl is-animating"
              @click="router.push('/call/room/' + coming_call.room_id)"
            >
              <i data-v-4d521fc4="" data-name="phone" data-tags="call" data-type="phone" class="feather feather--phone"
                ><IconHome class="text-xl"
              /></i>
            </button>

            <button
              href="javascript:void(0)"
              class="icon-btn btn-danger button-effect btn-xl is-animating"
              @click="coming_call = null"
            >
              <i data-v-4d521fc4="" data-name="phone" data-tags="call" data-type="phone" class="feather feather--phone"
                ><IconHome class="text-xl"
              /></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-accent.is-animating,
.btn-danger.is-animating {
  box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
}

.is-animating.btn-danger {
  animation: phone-outer-danger 3s infinite;
}

.is-animating.btn-accent {
  animation: phone-outer-accent 3s infinite;
}

.is-animating:before {
  animation: phone-inner 3s infinite;
  background-color: hsla(0, 0%, 100%, 0.2);
  border-radius: 100%;
  content: '';
  height: 50px;
  left: 0;
  opacity: 1;
  position: absolute;
  top: 0;
  transform: translateZ(0) scale(0);
  width: 50px;
}

.icon-btn.btn-xl {
  height: 50px;
  padding: 18px;
  width: 50px;
}

.is-animating {
  transform: translateZ(0) scale(1);
}

.button-effect {
  display: inline-flex;
  overflow: hidden;
  position: relative;
}

.btn-danger:hover {
  background-color: #f72900;
}

.btn-accent:hover {
  background-color: #29e558;
}

.icon-btn {
  align-items: center;
  border: 0 !important;
  border-radius: 100%;
  display: inline-flex;
  font-weight: 800;
  height: 42px;
  justify-content: center;
  width: 42px;
  rotate: calc(135deg);
}

.icon-btn > svg {
  fill: white;
  stroke: white;
}

.btn-danger {
  background-color: #ff4e2b;
  border-color: #ff4e2b !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.btn-accent {
  background-color: var(--system_accent_color);
  border-color: var(--system_accent_color) !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.button-effect:before {
  background: hsla(0, 0%, 100%, 0.2);
  display: block;
  z-index: 2;
}

@keyframes phone-inner {
  0% {
    opacity: 1;
    transform: translateZ(0) scale(0);
  }

  33.3333% {
    opacity: 1;
    transform: translateZ(0) scale(0.9);
  }
  66.6666% {
    opacity: 0;
    transform: translateZ(0) scale(0);
  }
  100% {
    opacity: 0;
    transform: translateZ(0) scale(0);
  }
}

@keyframes phone-outer-danger {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
  33.3333% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0.9), 0 0.05em 0.1em rgba(0, 0, 0, 0.5);
    transform: translateZ(0) scale(1.1);
  }
  66.6666% {
    box-shadow: 0 0 0 1.2em rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
}

@keyframes phone-outer-accent {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
  33.3333% {
    box-shadow: 0 0 0 0 rgba(107, 225, 133, 0.9), 0 0.05em 0.1em rgba(0, 0, 0, 0.5);
    transform: translateZ(0) scale(1.1);
  }
  66.6666% {
    box-shadow: 0 0 0 1.2em rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 78, 43, 0), 0 0.05em 0.1em rgba(0, 0, 0, 0.2);
    transform: translateZ(0) scale(1);
  }
}
</style>
