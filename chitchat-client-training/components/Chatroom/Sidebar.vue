<script lang="ts" setup>
import { useModal, ModalsContainer } from 'vue-final-modal';
import useGetAllChatRoom from '@/composables/use-get-chatrooms';
import ModalCreateChatroom from '@/components/Modal/CreateChatroom.vue';
import { chatroomList, setChatroomShow, setChatroomList } from '@/composables/states';

const { data } = useAuth();

const emit = defineEmits(['fetch_messages']);
// Vue final modal
const { open, close } = useModal({
  component: ModalCreateChatroom,
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      close();
    },
  },
  slots: {
    default: '<p>UseModal: The content of the modal</p>',
  },
});

const handleClick = (chatroomId: string) => {
  setChatroomShow(chatroomId);
  emit('fetch_messages', chatroomId);
};

onMounted(() => {
  (async () => {
    const result = await useGetAllChatRoom(data?.value?.email);
    setChatroomList(result.data);
  })();
});
</script>

<template>
  <div class="w-full bg-white border-r border-gray-300">
    <!-- <div class="w-fit h-fit fixed bottom-10 right-10">
      <Icon name="material-symbols:add-circle" class="text-xl text-primary" />
    </div> -->
    <!-- Sidebar Header -->
    <header class="p-4 border-b border-gray-300 flex justify-between items-center bg-chatroom_default text-white">
      <h1 class="flexCenter text-2xl font-bold">Chit Chat</h1>
      <div class="relative">
        <button id="menuButton" class="focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-100" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
          </svg>
        </button>
        <!-- Menu Dropdown -->
        <div
          id="menuDropdown"
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg hidden"
        >
          <ul class="py-2 px-3">
            <li><a href="#" class="block px-4 py-2 text-gray-800 hover:text-gray-400">Option 1</a></li>
            <li><a href="#" class="block px-4 py-2 text-gray-800 hover:text-gray-400">Option 2</a></li>
            <!-- Add more menu options here -->
          </ul>
        </div>
      </div>
    </header>

    <!-- Contact List -->
    <div v-if="chatroomList.length > 0" id="scrollbar" class="overflow-y-scroll h-screen py-3">
      <div
        v-for="chatroom in chatroomList"
        class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
        :class="chatroomShow === chatroom._id && 'bg-chatroom_default'"
        @click="handleClick(chatroom._id)"
      >
        <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
          <img
            src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
            alt="User Avatar"
            class="w-12 h-12 rounded-full"
          />
        </div>
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ chatroom?.name }}</h2>
          <p class="text-gray-600">Hoorayy!!</p>
        </div>
      </div>
    </div>

    <div v-else class="grid place-items-center w-full mt-40">
      <h2 class="text-title text-xl text-center font-bold">You are not have Chatroom!</h2>
      <button
        class="text-white bg-primary px-5 py-2 rounded-full mt-4 transition-all duration-200 ease-linear hover:opacity-70"
        @click="() => open()"
      >
        Create new Chatroom
      </button>
    </div>
  </div>

  <ModalsContainer />
</template>
