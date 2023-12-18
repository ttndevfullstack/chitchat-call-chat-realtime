<script lang="ts" setup>
import 'vue3-carousel/dist/carousel.css';
import type { Chatroom, User } from '~/types/common';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { useModal, ModalsContainer } from 'vue-final-modal';
import useSocketIO from '@/plugins/socket-io';
import useGetChatrooms from '@/composables/use-get-chatrooms';
import useGetFriends from '@/composables/use-get-friends';
import useGetMembers from '@/composables/use-get-members';
import ModalCreateChatroom from '@/components/Modal/CreateChatroom.vue';
import ModalCreateNewChat from '@/components/Modal/CreateNewChat.vue';
import ModalCreateCall from '@/components/Modal/CreateCall.vue';

const emit = defineEmits(['update:chatroom_id', 'update:is_hidden']);

const $io = useSocketIO();
const { data }: { data: any } = useAuth();
const user_email = data.value?.user?.email;
const router = useRouter();
const room_type = ref<string>('direct');
const action_type = ref<string>('chat');
const friend_list = ref<User[]>([]);
const chatroom_show = ref<Chatroom | null>(null);
const chatroom_list = ref<Chatroom[]>([]);
const member_list = ref<User[]>([]);
const search_value = ref<string>('');
const is_show = ref<any>({
  new_menu: false,
  search: false,
  navigate: true,
});

const params = computed(() => ({
  email: data?.value?.user?.email,
  room_type: room_type.value,
}));

const { chatrooms } = useGetChatrooms(params);
const { friends, isFetching: is_fetching_friends } = useGetFriends(params);
const { members } = useGetMembers();

watch(
  () => chatrooms.value,
  (value) => (chatroom_list.value = value),
  { deep: true },
);
watch(
  () => members.value,
  (value) => (member_list.value = value),
  { deep: true },
);
watch(
  () => friends.value,
  (value) => (friend_list.value = value),
  { deep: true },
);

onMounted(() => {
  $io.on('user_status', (data: any) => {
    const user: User = JSON.parse(data);
    updateStatus(user);
  });
});
chatroom_list.value = chatrooms.value;

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

const handleClickChatroom = (chatroom: Chatroom) => {
  chatroom_show.value = chatroom;
  emit('update:chatroom_id', chatroom);
};

const handleCall = (room_id: string) => {
  if (!room_id) return;
  router.push('/call/room/' + room_id);
};

const handleHidden = () => {
  is_show.navigate.value = !is_show.navigate.value;
  emit('update:is_hidden', is_show.navigate.value);
};

const handleSearch = () => {
  const searchText = search_value.value.toLowerCase().trim();

  if (!searchText) {
    chatroom_list.value = chatrooms.value;
  } else {
    if (room_type.value == 'direct') {
      chatroom_list.value = chatrooms.value.filter((chatroom: Chatroom) => {
        let email;
        if (chatroom.members[0].includes(user_email)) {
          email = chatroom.members[1];
        } else {
          email = chatroom.members[0];
        }
        return email.includes(searchText);
      });
    } else {
      chatroom_list.value = chatrooms.value.filter((chatroom: Chatroom) => chatroom.name.includes(searchText));
    }
  }
};

const updateStatus = (user: User) => {
  const updated_friend_status = friend_list.value.map((friend) => {
    if (!friend.email.includes(user?.email)) return friend;
    return { ...friend, status: user.status };
  });
  const updated_member_status = member_list.value.map((member) => {
    if (!member.email.includes(user?.email)) return member;
    return { ...member, status: user.status };
  });
  const updated_chatroom_status = chatroom_list.value.map((chatroom) => {
    if (chatroom.members.includes(user_email)) return chatroom;
    return { ...chatroom, status: user.status };
  });

  friend_list.value = updated_friend_status;
  member_list.value = updated_member_status;
  chatroom_list.value = updated_chatroom_status;
};
</script>

<template>
  <div class="relative flex flex-col h-full w-full bg-white transition-all duration-200 ease-out">
    <!-- Sidebar Header -->
    <header class="flex flex-col lg:px-[40px] md:px-[20px] pt-[40px] pb-2">
      <div class="flexBetween">
        <div class="flex flex-col">
          <h2>Recent</h2>
          <h4>Chat from your friends 😘</h4>
        </div>

        <button
          class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-button_secondary text-btn_secondary hover:bg-button_hover"
          @click="handleHidden"
        >
          <Icon name="iconoir:view-grid" size="18px" />
        </button>
      </div>

      <div v-if="!is_fetching_friends" class="mt-5">
        <carousel :items-to-show="3" :itemsToScroll="1" wrap-around autoplay="2000">
          <slide v-for="(item, index) in friends" :key="index">
            <div class="relative h-[110px] w-[96px] rounded-xl overflow-hidden">
              <NuxtImg :src="item?.avatar" class="object-cover h-full w-full" />
              <div class="absolute z-10 bottom-2 flexBetween px-3 w-full">
                <h6 class="text-white">{{ item?.username }}</h6>
                <div
                  class="w-2 h-2 rounded-full"
                  :class="[{ 'bg-error': item?.status === 'offline' }, { 'bg-accent': item?.status === 'online' }]"
                ></div>
              </div>
              <div class="absolute top-0 left-0 w-full h-full avatar_shadow"></div>
            </div>
          </slide>

          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
      </div>

      <div v-else class="mt-5 shadow p-4 max-w-sm w-full mx-auto">
        <div class="animate-pulse flex space-x-2">
          <div class="h-[110px] w-[96px] rounded-xl bg-slate-200"></div>
          <div class="h-[110px] w-[96px] rounded-xl bg-slate-200"></div>
          <div class="h-[110px] w-[96px] rounded-xl bg-slate-200"></div>
        </div>
      </div>
    </header>

    <!-- Contact List -->
    <article
      id="scrollbar"
      class="overflow-y-scroll scroll-smooth w-full h-[414px] transition-all duration-200 ease-out"
    >
      <nav class="flex flex-col gap-4 px-[40px]">
        <div class="relative flexBetween mt-8">
          <div class="flex flex-col">
            <h2>Chat</h2>
            <h4 class="text-text">Start New Conversation</h4>
          </div>

          <div class="w-fit h-full">
            <button
              class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-button_secondary text-btn_secondary hover:bg-button_hover"
              @click="is_show.search = !is_show.search"
            >
              <Icon name="ph:magnifying-glass-bold" size="17px" />
            </button>
          </div>

          <div v-if="is_show.search" class="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-out">
            <input
              type="text"
              placeholder="Search..."
              class="w-full h-full px-4 py-2 bg-white border-[1px] border-gray-2 00 rounded-lg outline-none focus:border-[3px] focus:border-[#c6e6fa]"
              v-model="search_value"
              @keyup="handleSearch"
            />

            <div
              class="absolute top-[-3px] right-4 -translate-y-[-50%] cursor-pointer p-1"
              @click="is_show.search = !is_show.search"
            >
              <Icon name="material-symbols:close" class="text-text" size="20px" />
            </div>
          </div>
        </div>

        <div class="flexCenter lg:flex-nowrap md:flex-wrap gap-3 w-full">
          <div
            class="flexCenter rounded-full cursor-pointer hover:opacity-70 transition-all duration-200 ease-linear"
            :class="action_type === 'chat' ? 'bg-primary text-white' : 'bg-button_secondary text-btn_secondary'"
            @click="action_type = 'chat'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1">
              <Icon name="ic:outline-chat-bubble-outline" class="mt-[1px]" />
              <h5 class="text-current">Chat</h5>
            </div>
          </div>

          <div
            class="flexCenter rounded-full hover:opacity-70 transition-all duration-200 ease-linear"
            :class="action_type === 'call' ? 'bg-primary text-white' : 'bg-button_secondary text-btn_secondary'"
            @click="action_type = 'call'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1 cursor-pointer">
              <Icon name="ph:phone" size="18px" />
              <h5 class="text-current">Call</h5>
            </div>
          </div>

          <div
            class="flexCenter rounded-full hover:opacity-70 transition-all duration-200 ease-linear"
            :class="action_type === 'contact' ? 'bg-primary text-white' : 'bg-button_secondary text-btn_secondary'"
            @click="action_type = 'contact'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1 cursor-pointer">
              <Icon name="material-symbols:group-outline-rounded" size="17px" />
              <h5 class="text-current">Contact</h5>
            </div>
          </div>
        </div>

        <div class="flexBetween transition-all duration-300 ease-linear pt-4 pb-2">
          <div
            class="flexCenter rounded-xl hover:opacity-70 py-1 w-[45%] transition-all duration-200 ease-linear cursor-pointer"
            :class="room_type === 'direct' ? 'bg-[#ddf0fc] text-primary' : 'bg-button_secondary text-title'"
            @click="room_type = 'direct'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1 cursor-pointer">
              <h5 class="text-current">Direct</h5>
            </div>
          </div>

          <div
            class="flexCenter rounded-xl hover:opacity-70 py-1 w-[45%] transition-all duration-200 ease-linear cursor-pointer"
            :class="room_type === 'group' ? 'bg-[#ddf0fc] text-primary' : 'bg-button_secondary text-title'"
            @click="room_type = 'group'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1 cursor-pointer">
              <h5 class="text-current">Group</h5>
            </div>
          </div>
        </div>
      </nav>

      <main v-if="!is_fetching_friends" class="w-full h-fit mt-3 transition-all duration-300 ease-out">
        <div
          v-if="chatroom_list?.length > 0"
          v-for="item in chatroom_list"
          id="pin_parent"
          class="relative flexBetween w-full h-fit py-[15px] border-primary border-solid lg:px-[30px] sm:px-[10px] cursor-pointer transition-all duration-200 ease-out hover:shadow-inner"
          :class="item?._id.includes(chatroom_show?._id!) ? 'bg-chatroom_default border-l-[4px]' : 'bg-white border-l-0'"
          @click="handleClickChatroom(item)"
        >
          <div id="pin" class="absolute top-0 right-9 transition-all duration-200 ease-linear">
            <Icon name="eos-icons:push-pin-outlined" class="text-text" />
          </div>
          <div class="flexStart gap-3">
            <div class="relative w-[60px] h-[60px] rounded-2xl">
              <NuxtImg :src="item?.avatar" alt="Avatar.png" class="w-full h-full object-cover rounded-2xl" />

              <!-- Check Status Of Direct -->
              <div v-if="item?.total_member?.toString() == '2'">
                <div v-for="(member, index) in member_list" :key="index">
                  <div v-if="item.members.includes(member?.email) && !member?.email.includes(user_email)">
                    <div
                      v-if="member?.status == 'online'"
                      class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-accent border-[2px] border-white rounded-full"
                    ></div>
                    <div
                      v-else
                      class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-error border-[2px] border-white rounded-full"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Check Status Of Group -->
              <div v-else>
                <div
                  v-if="item?.status == 'online'"
                  class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-accent border-[2px] border-white rounded-full"
                ></div>
                <div
                  v-else
                  class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-error border-[2px] border-white rounded-full"
                ></div>
              </div>
              <!-- <div v-for="(member, index) in member_list" :key="index">
                <div v-if="item?.members?.includes(member?.email) && !member?.email.includes(user_email)">
                  <div
                    v-if="member?.status == 'online'"
                    class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-accent border-[2px] border-white rounded-full"
                  ></div>
                  <div
                    v-else
                    class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-error border-[2px] border-white rounded-full"
                  ></div>
                </div>
              </div> -->
            </div>

            <div class="flex flex-col gap-2">
              <div v-if="item?.total_member.toString() == '2'">
                <h5 v-if="item?.members[0]?.includes(user_email)">{{ item?.members[1] }}</h5>
                <h5 v-else>{{ item?.members[0] }}</h5>
              </div>

              <div v-else>
                <h5>{{ item?.name }}</h5>
              </div>

              <div v-if="action_type == 'chat'">
                <span
                  class="text-xs"
                  :class="item?._id.includes(chatroom_show?._id!) ? 'text-primary font-semibold' : 'text-text'"
                >
                  Hi, i am josephin. How are...
                </span>
              </div>
              <div v-if="action_type == 'call'">
                <div class="flexStart gap-1">
                  <Icon name="iconamoon:arrow-bottom-left-1-light" class="bg-transparent text-accent" size="18px" />
                  <h6 class="mt-1px">3:30 pm</h6>
                </div>
              </div>
              <div v-if="action_type == 'contact'">
                <h6>+21 3523 25544</h6>
              </div>
            </div>
          </div>

          <div v-if="action_type == 'chat'">
            <div class="lg:flex flex-col items-end gap-2 sm:hidden">
              <span>22/10/19</span>
              <h6 class="text-accent">Seen</h6>
            </div>
          </div>

          <div v-if="action_type == 'call'">
            <div class="flexCenter h-full w-fit">
              <button
                class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-[#3fcc35] bg-[#e2f7e1] hover:bg-[#cff2cc]"
                @click="handleCall(chatroom_show?._id!)"
              >
                <Icon name="ph:phone" size="18px" />
              </button>
            </div>
          </div>

          <div v-if="action_type == 'contact'">
            <div class="flexCenter gap-2 h-full w-fit">
              <button
                class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-[#3fcc35] bg-[#c0e3f9] text-primary hover:bg-[#cff2cc]"
              >
                <Icon name="ph:phone" size="18px" />
              </button>

              <button
                class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-[#3fcc35] bg-[#e2f7e1] hover:bg-[#cff2cc]"
              >
                <Icon name="ep:video-camera" size="18px" />
              </button>
            </div>
          </div>
        </div>

        <main v-else class="w-full h-fit mt-3 transition-all duration-300 ease-out">
          <div class="flexCenter flex-col h-fit w-fit px-10 py-16">
            <div class="w-[100px] h-[100px]">
              <NuxtImg src="notfound_chatroom.png" class="w-full h-full object-cover" />
            </div>
            <p class="text-text text-lg font-semibold mt-4 text-center">You have not joined the chat room yet</p>
          </div>
        </main>
      </main>

      <main v-else class="w-full h-fit mt-3 transition-all duration-300 ease-out">
        <Fetching />
      </main>
    </article>

    <div
      class="absolute bottom-6 right-6 flexCenter w-[42px] h-[42px] rounded-full bg-primary text-white hover:bg-[#1280c1] cursor-pointer"
      @click="is_show.new_menu = !is_show.new_menu"
    >
      <Icon name="material-symbols:add-rounded" size="22px" />
    </div>

    <div
      v-if="is_show.new_menu"
      class="absolute bottom-[68px] right-10 w-fit h-fit bg-white shadow-xl rounded-md transition-all duration-500 ease-out"
    >
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
  </div>

  <ModalsContainer />
</template>

<style>
.carousel__pagination {
  display: none !important;
}
.carousel__prev,
.carousel__next {
  display: none !important;
}

.line {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 2px;
  border-radius: 15px;
  background-color: #4b9cdb;
}

.load-3 .line:nth-last-child(1) {
  animation: loadingC 0.6s 0.1s linear infinite;
}
.load-3 .line:nth-last-child(2) {
  animation: loadingC 0.6s 0.2s linear infinite;
}
.load-3 .line:nth-last-child(3) {
  animation: loadingC 0.6s 0.3s linear infinite;
}

.avatar_shadow {
  border-radius: 15px;
  box-shadow: inset 0 -25px 30px 6px rgba(0, 0, 0, 0.8);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

#pin_parent:hover #pin {
  display: block !important;
}

#pin {
  display: none;
}

@keyframes loadingC {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 15px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
