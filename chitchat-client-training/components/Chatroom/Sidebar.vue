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
const is_hidden = ref<boolean>(false);

const params = computed(() => ({
  email: data?.value?.user?.email,
  room_type: room_type.value,
}));

const { chatrooms, isFetching } = useGetChatrooms(params);
const { friends } = useGetFriends(params);
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

// Vue final modal
const { open, close } = useModal({
  component: ModalCreateChatroom,
  attrs: {
    onConfirm() {
      close();
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
  console.log('updated_friend_status:', updated_friend_status);
  console.log('updated_member_status:', updated_member_status);
  friend_list.value = updated_friend_status;
  member_list.value = updated_member_status;
  chatroom_list.value = updated_chatroom_status;
};
</script>

<template>
  <div class="relative flex flex-col h-full w-full bg-white">
    <!-- Sidebar Header -->
    <header class="flex flex-col lg:px-[40px] md:px-[20px] pt-[40px] pb-2">
      <div class="flexBetween">
        <div class="flex flex-col">
          <h2>Recent</h2>
          <h4>Chat from your friends 😘</h4>
        </div>

        <button
          class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-button_secondary text-btn_secondary hover:bg-button_hover"
          @click="emit('update:is_hidden', !is_hidden)"
        >
          <Icon name="iconoir:view-grid" size="18px" />
        </button>
      </div>

      <div class="mt-5">
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
              <div class="absolute top-0 left-0 w-full h-full gradient"></div>
            </div>
          </slide>

          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
      </div>
    </header>

    <!-- Contact List -->
    <article
      v-if="!isFetching"
      id="scrollbar"
      class="overflow-y-scroll scroll-smooth w-full h-[414px] transition-all duration-200 ease-linear"
    >
      <nav class="flex flex-col gap-4 px-[40px]">
        <div class="flexBetween pt-8">
          <div class="flex flex-col">
            <h2>Chat</h2>
            <h4 class="text-text">Start New Conversation</h4>
          </div>

          <div class="flexCenter w-fit h-full">
            <Button icon-name="ph:magnifying-glass-bold" secondary width="34px" height="34px" size="17px" />
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

      <main class="w-full h-fit mt-3">
        <div
          v-if="chatroom_list?.length > 0"
          v-for="item in chatroom_list"
          class="flexBetween w-full h-fit py-[15px] border-primary border-solid lg:px-[30px] sm:px-[10px] cursor-pointer transition-all duration-200 ease-out"
          :class="item?._id.includes(chatroom_show?._id!) ? 'bg-chatroom_default border-l-[4px]' : 'bg-white border-l-0'"
          @click="handleClickChatroom(item)"
        >
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
                <h6 :class="item?._id.includes(chatroom_show?._id!) ? 'text-primary' : 'text-text'">
                  Hi, i am josephin. How are...
                </h6>
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

        <div v-else class="flexCenter flex-1 w-full h-full">
          <div class="flexCenter flex-col h-fit w-fit px-10 py-16">
            <div class="w-[100px] h-[100px]">
              <NuxtImg src="notfound_chatroom.png" class="w-full h-full object-cover" />
            </div>
            <p class="text-text text-lg font-semibold mt-4 text-center">You have not joined the chat room yet</p>
          </div>
        </div>
      </main>
    </article>

    <div
      class="absolute bottom-6 right-6 flexCenter w-[42px] h-[42px] rounded-full bg-primary text-white hover:bg-[#1280c1]"
      @click="open()"
    >
      <Icon name="material-symbols:add-rounded" size="22px" />
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
.gradient {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 20px -12px inset, rgba(0, 0, 0, 0.3) 0px -4px 36px -18px inset;
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
