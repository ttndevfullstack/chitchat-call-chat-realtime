<script lang="ts" setup>
import { useModal } from 'vue-final-modal';
import ModalCreateChatroom from '@/components/Modal/CreateChatroom.vue';
import ModalCreateNewChat from '@/components/Modal/CreateNewChat.vue';
import ModalCreateCall from '@/components/Modal/CreateCall.vue';

// Vue final modal
const { open: openCreateChatroom, close: closeCreateChatroom } = useModal({
  component: ModalCreateChatroom,
  attrs: {
    onConfirm() {
      closeCreateChatroom();
    },
  },
});
const { open: openCreateCall, close: closeCreateCall } = useModal({
  component: ModalCreateCall,
  attrs: {
    onConfirm() {
      closeCreateCall();
    },
  },
});
const { open: openCreateNewChat, close: closeCreateNewChat } = useModal({
  component: ModalCreateNewChat,
  attrs: {
    onConfirm() {
      closeCreateNewChat();
    },
  },
});
</script>

<template>
  <div class="bg-white shadow-xl rounded-md transition-all duration-500 ease-out">
    <ul>
      <li
        class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear"
        @click="openCreateNewChat"
      >
        <div class="flexEnd px-4 gap-4">
          <h1 class="text-sm font-semibold text-title">New Chat</h1>
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa] cursor-pointer"
          >
            <Icon name="ic:outline-chat-bubble-outline" size="15px" />
          </button>
        </div>
      </li>

      <li
        class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear"
        @click="openCreateCall"
      >
        <div class="flexEnd px-4 gap-4">
          <h1 class="text-sm font-semibold text-title">New Call</h1>
          <button
            class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-[#3fcc35] bg-[#e2f7e1] hover:bg-[#cff2cc] cursor-pointer"
          >
            <Icon name="ph:phone" size="18px" />
          </button>
        </div>
      </li>

      <li
        class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear"
        @click="openCreateChatroom"
      >
        <div class="flexEnd px-4 gap-4">
          <h1 class="text-sm font-semibold text-title">New Room</h1>
          <button
            class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-[#ffe5df] text-error hover:bg-[#ffd3ca] cursor-pointer"
          >
            <Icon name="material-symbols:group-outline-rounded" size="18px" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
