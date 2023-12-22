<script lang="ts" setup>
import { useModal } from 'vue-final-modal';
import ModalCreateChatroom from '@/components/Modal/CreateChatroom.vue';
import ModalCreateNewChat from '@/components/Modal/CreateNewChat.vue';
import ModalCreateCall from '@/components/Modal/CreateCall.vue';

const { $deleteChatroom }: any = useNuxtApp();

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
      <li class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear" @click="">
        <div class="flexStart px-4 gap-3">
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-primary bg-[#ddf0fc] cursor-pointer"
          >
            <Icon name="ic:baseline-person-outline" size="18px" />
          </button>
          <h1 class="text-sm font-bold text-title">Profile</h1>
        </div>
      </li>

      <li
        class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear"
        @click="$deleteChatroom.$emit('delete:chatroom')"
      >
        <div class="flexStart px-4 gap-3">
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-[#ffe5df] text-error cursor-pointer"
          >
            <Icon name="material-symbols-light:delete-outline-rounded" size="20px" />
          </button>
          <h1 class="text-sm font-bold text-title">Delete</h1>
        </div>
      </li>

      <li class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear" @click="">
        <div class="flexStart px-4 gap-3">
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-button_secondary text-title cursor-pointer"
          >
            <Icon name="ri:forbid-line" size="18px" />
          </button>
          <h1 class="text-sm font-bold text-title">Block</h1>
        </div>
      </li>
    </ul>
  </div>
</template>
