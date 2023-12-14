<script lang="ts" setup>
import 'vue3-carousel/dist/carousel.css';
import type { Chatroom, User } from '~/types/common';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { useModal, ModalsContainer } from 'vue-final-modal';
import useSocketIO from '@/plugins/socket-io';
import useGetChatrooms from '@/composables/use-get-chatrooms';
import useGetFriends from '@/composables/use-get-friends';
import ModalCreateChatroom from '@/components/Modal/CreateChatroom.vue';

const emit = defineEmits(['update:chatroom_id', 'update:is_hidden']);

const $io = useSocketIO();
const { data }: { data: any } = useAuth();
const room_type = ref<string>('direct');
const action_type = ref<string>('chat');
const friend_list = ref<User[]>([]);
const chatroom_show = ref<Chatroom | null>(null);
const chatroom_list = ref<Chatroom[]>([]);
const member_list = ref<User[]>([]);

const params = computed(() => ({
  email: data?.value?.user?.email,
  room_type: room_type.value,
  chatroom_id: chatroom_show.value?._id,
}));

const { chatrooms } = useGetChatrooms(params);
const { friends } = useGetFriends(params);
const { members } = useGetMembers(params);

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
    const updated_friend_status = friend_list.value.map((friend) => {
      if (!friend.email.includes(user?.email)) return friend;
      return { ...friend, status: user.status };
    });
    const updated_chatroom_status = chatroom_list.value.map((chatroom) => {
      if (!chatroom.members.includes(user?.email)) return chatroom;
      return { ...chatroom, status: user.status };
    });

    friend_list.value = updated_friend_status;
    chatroom_list.value = updated_chatroom_status;
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
          @click="emit('update:is_hidden')"
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
    <article id="scrollbar" class="overflow-y-scroll scroll-smooth w-full h-[414px]">
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
          <NuxLink
            href="/"
            class="flexCenter rounded-full cursor-pointer hover:opacity-70 transition-all duration-200 ease-linear"
            :class="action_type === 'chat' ? 'bg-primary text-white' : 'bg-button_secondary text-btn_secondary'"
            @click="action_type = 'chat'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1">
              <Icon name="ic:outline-chat-bubble-outline" class="mt-[1px]" />
              <h5 class="text-current">Chat</h5>
            </div>
          </NuxLink>

          <NuxtLink
            :href="'/call/room/' + chatroom_show?._id"
            class="flexCenter rounded-full hover:opacity-70 transition-all duration-200 ease-linear"
            :class="action_type === 'call' ? 'bg-primary text-white' : 'bg-button_secondary text-btn_secondary'"
            @click="action_type = 'call'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1">
              <Icon name="ph:phone" size="18px" />
              <h5 class="text-current">Call</h5>
            </div>
          </NuxtLink>

          <NuxtLink
            href="/"
            class="flexCenter rounded-full hover:opacity-70 transition-all duration-200 ease-linear"
            :class="action_type === 'contact' ? 'bg-primary text-white' : 'bg-button_secondary text-btn_secondary'"
            @click="action_type = 'contact'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1">
              <Icon name="material-symbols:group-outline-rounded" size="17px" />
              <h5 class="text-current">Contact</h5>
            </div>
          </NuxtLink>
        </div>

        <div class="flexBetween transition-all duration-300 ease-linear pt-4 pb-2">
          <div
            class="flexCenter rounded-xl hover:opacity-70 py-1 w-[45%] transition-all duration-200 ease-linear cursor-pointer"
            :class="room_type === 'direct' ? 'bg-[#ddf0fc] text-primary' : 'bg-button_secondary text-title'"
            @click="room_type = 'direct'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1">
              <h5 class="text-current">Direct</h5>
            </div>
          </div>

          <div
            class="flexCenter rounded-xl hover:opacity-70 py-1 w-[45%] transition-all duration-200 ease-linear cursor-pointer"
            :class="room_type === 'group' ? 'bg-[#ddf0fc] text-primary' : 'bg-button_secondary text-title'"
            @click="room_type = 'group'"
          >
            <div class="flexCenter gap-1 h-fit w-fit px-4 py-1">
              <h5 class="text-current">Group</h5>
            </div>
          </div>
        </div>
      </nav>

      <main class="w-full h-fit mt-3">
        <div
          v-if="chatroom_list?.length > 0"
          v-for="item in chatroom_list"
          class="flexBetween w-full h-fit py-[15px] border-primary border-solid px-[40px] cursor-pointer transition-all duration-200 ease-out"
          :class="item?._id.includes(chatroom_show?._id!) ? 'bg-chatroom_default border-l-[4px]' : 'bg-white border-l-0'"
          @click="handleClickChatroom(item)"
        >
          <div class="flexStart gap-3">
            <div class="relative w-[60px] h-[60px] rounded-2xl">
              <NuxtImg :src="item?.avatar" alt="Avatar.png" class="w-full h-full object-cover rounded-2xl" />
              <!-- <div
                class="absolute top-1 right-1 w-[6px] h-[6px] border-white border-[1px] border-solid"
                :class="{ item?.status === 'online' ? 'bg-accent' : 'bg-error' }"
              ></div> -->
              <div
                v-if="item?.status"
                class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-accent border-[2px] border-white rounded-full"
              ></div>
              <div
                v-else
                class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-error border-[2px] border-white rounded-full"
              ></div>
            </div>

            <div class="flex flex-col gap-1">
              <h5>{{ item?.name }}</h5>
              <h6 :class="item?._id.includes(chatroom_show?._id!) ? 'text-primary' : 'text-text'">
                Hi, i am josephin. How are...
              </h6>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1">
            <span>22/10/19</span>
            <h6 class="text-accent">Seen</h6>
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
      </main>
    </article>

    <div
      class="absolute bottom-6 right-6 flexCenter w-[42px] h-[42px] rounded-full bg-primary text-white hover:bg-[#1280c1]"
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
</style>
