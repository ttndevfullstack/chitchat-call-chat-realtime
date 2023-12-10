<script lang="ts" setup>
import type { Message } from '@/types/common';
import useSocketIO from '@/plugins/socket-io';
import useGetMessageInChatroom from '@/composables/use-get-messages';
import getFormattedTimestamp from '@/helpers/getFormattedTimestamp';
import useApi from '@/plugins/api';
import { chatroomShow } from '@/composables/states';

const { data } = useAuth();
const $io = useSocketIO();
const $api = useApi();
const messages = ref<Message[]>([]);
const message = ref<string>('');

const fetchMessages = async (chatroomId: string) => {
  if (!chatroomId) return;
  const response = await useGetMessageInChatroom(chatroomId);
  messages.value = response.data;
};

const sendMessage = () => {
  if (message.value === '' || chatroomShow.value === '' || !data.value?.user?.email || !data.value?.user?.email) return;

  const newMessage: Message = {
    chatroom_id: chatroomShow.value,
    content: message.value,
    type: 'text',
    sender: data.value?.user?.email!,
    sendAt: getFormattedTimestamp(),
  };

  $api.message.sendMessage(newMessage);

  message.value = '';
  document.getElementById('send')?.focus();
};

onMounted(() => {
  if (!$io.connected) {
    $io.on('connect', () => {
      console.log('Socket connected', $io.id);
    });
  }

  $io.on('disconnect', () => {
    console.log('Socket disconnected', $io.id);
  });
});

$io.on('answer', (data: any) => {
  console.log(data);
  if (data?.chatroom_id && data?.chatroom_id === chatroomShow.value) {
    messages.value.push(data);
  }
});
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="h-full w-nav bg-nav_default">
      <Navigate />
    </div>

    <main class="grid grid-cols-12 flex-1 w-full h-full">
      <!-- Sidebar -->
      <div class="col-span-4 bg-sidebar_default">
        <ChatroomSidebar :chatroom-show="chatroomShow" @fetch_messages="fetchMessages" />
      </div>

      <!-- Main Chat Area -->
      <div class="col-span-8 flex-1 w-full h-full">
        <div class="relative flex flex-col w-full h-screen">
          <!-- Chat Header -->
          <header class="bg-white p-4 text-gray-700">
            <h1 class="text-2xl font-semibold">{{ data?.user?.email }}</h1>
          </header>

          <!-- Chat Messages -->
          <div id="scrollbar" class="flex-1 w-full h-full overflow-y-scroll p-4 pb-36 bg-chatroom_default">
            <div v-for="message in messages" :key="message._id" class="flex mb-4 cursor-pointer">
              <!-- Incoming Message -->
              <template v-if="message?.sender.toString() !== data?.user?.email?.toString()">
                <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <img
                    src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                    alt="User Avatar"
                    class="w-8 h-8 rounded-full"
                  />
                </div>
                <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                  <p class="text-gray-700">{{ message?.content }}</p>
                </div>
              </template>

              <!-- Outgoing Message -->
              <template v-else>
                <div class="flex justify-end ml-auto mb-4 cursor-pointer">
                  <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                    <p>{{ message?.content }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                    <img
                      src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                      alt="My Avatar"
                      class="w-8 h-8 rounded-full"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Chat Input -->
          <footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
            <div class="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                v-model="message"
              />
              <button id="send" class="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2" @click="sendMessage">
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </main>

    <div class="h-screen w-feature bg-feature_default">
      <FeatureList />
    </div>
  </div>
</template>
