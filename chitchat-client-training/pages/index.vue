<script lang="ts" setup>
import type { Chatroom, Message, User } from '@/types/common';
import useApi from '@/plugins/api';
import useSocketIO from '@/plugins/socket-io';
import useGetMembers from '@/composables/use-get-members';
import useGetMessages from '@/composables/use-get-messages';
import getFormattedTimestamp from '@/helpers/getFormattedTimestamp';

const { data } = useAuth();
const $io = useSocketIO();
const $api = useApi();
const chatroom_show = ref<Chatroom | null>(null);
const is_hidden = ref<boolean>(false);
const message_content = ref<string>('');
const message_list = ref<Message[]>([]);
const member_list = ref<User[]>([]);
const message_status = ref<string>('');
const user_email = data.value?.user?.email;

const params = computed(() => ({
  chatroom_id: chatroom_show.value?._id,
}));
const { messages, isFetching: is_fetching_messages, isFetched: is_fetched_messages } = useGetMessages(params);
const { members } = useGetMembers(params);

watch(
  () => messages.value,
  (value) => (message_list.value = value),
  { deep: true },
);
watch(
  () => members.value,
  (value) => (member_list.value = value),
  { deep: true },
);

onMounted(() => {
  $io.on('connect', () => {
    console.log('Socket connected', $io.id);
  });

  $io.on('disconnect', () => {
    console.log('Socket disconnected', $io.id);
  });

  $io.on('user_status', (data: any) => {
    const user = JSON.parse(data);
    const updated_member_list = member_list.value.map((member) => {
      if (!member.email.includes(user?.email)) return member;
      return { ...member, status: user.status };
    });
    member_list.value = updated_member_list;
  });

  $io.on('send_message', (data: any) => {
    const message: Message = JSON.parse(data);
    if (message?.sender?.includes(user_email!)) return;
    message_list.value = [...message_list.value, message];
  });
});

const sendMessage = () => {
  if (message_content.value === '' || chatroom_show.value?._id === '' || !user_email) return;

  const newMessage: Message = {
    chatroom_id: chatroom_show.value?._id!,
    content: message_content.value,
    type: 'text',
    sender: user_email!,
    send_at: getFormattedTimestamp(),
  };

  message_list.value = [...message_list.value, newMessage];
  try {
    message_status.value = 'Sending';
    $api.message.sendMessage(newMessage).then((data) => {
      if (data?.success) return (message_status.value = 'Sended');
      return (message_status.value = 'Failed');
    });
  } catch (error) {
  } finally {
    console.log('finally');
    message_content.value = '';
    document.getElementById('send')?.focus();
  }
};

const chatroomIdChange = (chatroom: Chatroom) => {
  chatroom_show.value = chatroom;
};

const hiddenNavigation = (value: boolean) => {
  alert(is_hidden);
  is_hidden.value = value;
};
</script>

<template>
  <div class="grid grid-cols-12 h-screen w-full">
    <div
      :id="is_hidden ? 'hidden' : ''"
      class="lg:block sm:hidden col-span-1 h-full w-full bg-nav_default transition-all duration-300 ease-linear"
    >
      <Navigate @update:is_hidden="hiddenNavigation" />
    </div>

    <main class="lg:col-span-10 sm:col-span-12 grid grid-cols-12 w-full h-full bg-chatroom_default">
      <!-- Sidebar -->
      <div class="md:block sm:hidden col-span-4 bg-sidebar_default w-full h-full">
        <ChatroomSidebar @update:chatroom_id="chatroomIdChange" />
      </div>

      <!-- Main Chat Area -->
      <div class="md:col-span-8 sm:col-span-12 h-full w-full">
        <div class="relative flex flex-col h-screen w-full pb-[94px]">
          <!-- Chat Header -->
          <div class="absolute top-[45px] left-0 lg:px-[45px] md:px-6 w-full">
            <header class="flexBetween px-[30px] py-[20px] bg-white w-full h-full">
              <div class="flexCenter gap-5">
                <div
                  v-if="chatroom_show"
                  class="w-[60px] h-[60px] rounded-2xl overflow-hidden transition-all duration-300 ease-out"
                >
                  <NuxtImg :src="chatroom_show?.avatar" alt="Avatar.png" class="w-full h-full object-cover" />
                  <!-- <div
                class="absolute top-1 right-1 w-[6px] h-[6px] border-white border-[1px] border-solid"
                :class="{ item?.status === 'online' ? 'bg-accent' : 'bg-error' }"
              ></div> -->
                </div>

                <div
                  v-if="chatroom_show"
                  class="flex flex-col gap-[10px] text-white w-fit border-r-[1px] border-gray-400 transition-all duration-300 ease-out pr-4"
                >
                  <div v-if="chatroom_show?.total_member.toString() == '2'">
                    <h5 v-if="chatroom_show?.members[0]?.includes(user_email!)">{{ chatroom_show?.members[1] }}</h5>
                    <h5 v-else>{{ chatroom_show?.members[0] }}</h5>
                  </div>

                  <div v-else>
                    <h5>{{ chatroom_show?.name }}</h5>
                  </div>

                  <div v-if="chatroom_show?.total_member.toString() == '2'">
                    <div v-for="(member, index) in member_list" :key="index">
                      <div v-if="chatroom_show?.members.includes(member.email) && !member.email.includes(user_email!)">
                        <div v-if="member?.status == 'online'">
                          <div class="flexCenter bg-accent rounded-full text-xs w-fit py-[1px] px-3">Active</div>
                        </div>
                        <div v-else>
                          <div class="flexCenter bg-error rounded-full text-xs w-fit py-[1px] px-3">InActive</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else>
                    <div v-if="chatroom_show?.status == 'online'">
                      <div class="flexCenter bg-accent rounded-full text-xs w-fit py-[1px] px-3">Active</div>
                    </div>
                    <div v-else>
                      <div class="flexCenter bg-error rounded-full text-xs w-fit py-[1px] px-3">InActive</div>
                    </div>
                  </div>
                </div>

                <div v-else class="flex-1 bg-transparent h-full w-[350px] transition-all duration-300 ease-out"></div>

                <div class="flexBetween gap-4">
                  <Button icon-name="ion:volume-high-sharp" secondary width="34px" height="34px" size="18px" />
                  <Button icon-name="ph:magnifying-glass-bold" secondary width="34px" height="34px" size="18" />
                </div>
              </div>

              <div class="flexCenter">
                <div class="flexCenter gap-2 lg:flex md:hidden">
                  <Button icon-name="ph:phone" secondary width="34px" height="34px" size="18" content="Audio Call" />
                  <Button
                    icon-name="ep:video-camera"
                    secondary
                    width="34px"
                    height="34px"
                    size="18"
                    content="Video Call"
                  />
                  <Button
                    icon-name="iconoir:view-grid"
                    secondary
                    width="34px"
                    height="34px"
                    size="18"
                    content="All Apps"
                  />
                </div>

                <Button
                  icon-name="humbleicons:dots-vertical"
                  width="34px"
                  height="34px"
                  size="22px"
                  content="All Apps"
                  transparent
                  :hover="false"
                />
              </div>
            </header>
          </div>

          <div class="h-[145px] w-full bg-transparent"></div>
          <!-- Chat Messages -->

          <main
            v-if="!is_fetched_messages || message_list.length > 0"
            id="scrollbar"
            class="flex-1 w-full h-full lg:px-[45px] md:px-6 py-4 overflow-y-scroll scroll-smooth"
          >
            <div
              v-for="(message, index) in message_list"
              :key="message._id"
              class="flex gap-3 cursor-pointer transition-all duration-300 ease-out"
            >
              <!-- Incoming Message -->
              <template v-if="!message?.sender?.includes(user_email!)">
                <div
                  v-if="!message_list[index - 1]?.sender.includes(message_list[index]?.sender)"
                  class="flexStart w-full h-full gap-3 py-2 mt-4"
                >
                  <div class="relative flexStart w-[50px] h-[50px] rounded-[20px] mr-2">
                    <NuxtImg
                      :src="chatroom_show?.avatar"
                      alt="Avatar"
                      class="w-full h-full object-cover rounded-[20px]"
                    />

                    <div v-for="(member, index) in member_list" :key="index">
                      <div v-if="member?.email === message?.sender">
                        <div
                          v-if="member?.status === 'online'"
                          class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-accent border-[2px] border-white rounded-full"
                        ></div>
                        <div
                          v-else
                          class="absolute top-[-1px] right-[-1px] w-[13px] h-[13px] bg-error border-[2px] border-white rounded-full"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <div class="flexStart gap-6">
                      <h5 v-if="!message_list[index - 1]?.sender.includes(message_list[index]?.sender)">
                        {{ message?.sender }}
                      </h5>
                      <!-- v-if="
                          messageIndex > 0 &&
                          checkTimeLessThanTwoMinutes(messages[messageIndex - 1].send_at, message.send_at)
                        " -->
                      <h6 class="mt-[2px]">
                        {{ message?.send_at.split(',')[0] }}
                      </h6>
                    </div>
                    <div
                      class="w-fit py-[10px] px-4 bg-message_come rounded-br-3xl rounded-tr-3xl rounded-bl-3xl text-title transition-all duration-200 ease-out"
                    >
                      {{ message?.content }}
                    </div>
                  </div>
                </div>

                <div v-else class="flexStart w-full h-full gap-3">
                  <div class="flexStart w-[50px] h-[50px] rounded-[20px] overflow-hidden mr-2">
                    <div class="w-[50px] h-[50px] bg-transparent"></div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <div
                      class="w-fit py-[10px] px-4 bg-message_come rounded-br-3xl rounded-tr-3xl rounded-bl-3xl text-title transition-all duration-200 ease-out"
                    >
                      {{ message?.content }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- Outgoing Message -->
              <template v-else class="flexEnd">
                <div
                  v-if="!message_list[index - 1]?.sender.includes(message_list[index]?.sender)"
                  class="flexEnd w-full h-full gap-3"
                >
                  <div class="flex flex-col items-end gap-2">
                    <div class="flexStart gap-6">
                      <h6 class="mt-[2px]">{{ message?.send_at.split(',')[0] }}</h6>
                      <h5 v-if="!message_list[index - 1]?.sender.includes(message_list[index]?.sender)">
                        {{ message?.sender }}
                      </h5>
                    </div>
                    <div
                      class="w-fit py-2 px-4 bg-message_send rounded-bl-3xl rounded-tl-3xl rounded-br-3xl text-white"
                    >
                      {{ message?.content }}
                    </div>
                  </div>

                  <div class="relative flexStart w-[50px] h-[50px] rounded-[20px] mr-2">
                    <NuxtImg
                      :src="chatroom_show?.avatar"
                      alt="Avatar"
                      class="w-full h-full object-cover rounded-[20px]"
                    />
                  </div>
                </div>

                <div v-else class="flexEnd w-full h-full gap-3">
                  <div class="flex flex-col gap-2">
                    <div class="flexStart gap-6"></div>
                    <div class="py-2 px-4 bg-message_send rounded-bl-3xl rounded-tl-3xl rounded-br-3xl text-white">
                      {{ message?.content }}
                    </div>
                  </div>

                  <div class="flexStart w-[50px] h-[50px] rounded-[20px] overflow-hidden mr-2">
                    <div class="w-[50px] h-[50px] bg-transparent"></div>
                  </div>
                </div>
                <!-- <div class="flexEnd ml-auto mt-2 mb-2 cursor-pointer">
                  <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                    <p>{{ message?.content }}</p>
                  </div>
                  <div class="w-[50px] h-[50px] flex items-center justify-center ml-2 rounded-[20px] overflow-hidden">
                    <NuxtImg src="/face4.jfif" alt="My Avatar" class="w-full h-full object-cover" />
                  </div>
                </div> -->
              </template>
            </div>
            <span
              class="flexEnd pr-20 mt-1 text-right w-full h-fit"
              :class="[
                { 'text-accent': message_status === 'Sended' },
                { 'text-warn': message_status === 'Sending' },
                { 'text-error': message_status === 'Failed' },
              ]"
              >{{ message_status }}</span
            >
          </main>

          <main v-else class="flexCenter flex-1 w-full h-full">
            <div class="flexCenter flex-col h-fit w-fit">
              <div class="w-[160px] h-[160px]">
                <NuxtImg src="notfound_chatroom.png" class="w-full h-full object-cover" />
              </div>
              <p class="text-text text-xl font-bold mt-4">Select a chat to read messages</p>
            </div>
          </main>

          <div v-if="is_fetching_messages" class="p-[24px] flex-1 w-full h-full transition-all duration-300 ease-out">
            <div class="flex flex-col gap-4 p-4 w-full">
              <div class="animate-pulse flex space-x-4">
                <div class="rounded-xl bg-slate-300 h-14 w-14"></div>
                <div class="w-72 space-y-2 py-1">
                  <div class="h-8 rounded-br-3xl rounded-tr-3xl rounded-bl-3xl bg-slate-300 rounded"></div>
                  <div class="w-3/4 h-8 rounded-br-3xl rounded-tr-3xl rounded-bl-3xl bg-slate-300 rounded"></div>
                </div>
              </div>

              <div class="flexEnd ml-auto w-full animate-pulse flex space-x-4">
                <div class="w-64 space-y-2 py-1">
                  <div class="h-8 rounded-bl-3xl rounded-tl-3xl rounded-br-3xl bg-slate-300 rounded"></div>
                  <div
                    class="ml-auto w-3/4 h-8 rounded-bl-3xl rounded-tl-3xl rounded-br-3xl bg-slate-300 rounded"
                  ></div>
                </div>
                <div class="rounded-xl bg-slate-300 h-14 w-14"></div>
              </div>

              <div class="animate-pulse flex space-x-4">
                <div class="rounded-xl bg-slate-300 h-14 w-14"></div>
                <div class="w-72 space-y-2 py-1">
                  <div class="h-8 rounded-br-3xl rounded-tr-3xl rounded-bl-3xl bg-slate-300 rounded"></div>
                  <div class="w-3/4 h-8 rounded-br-3xl rounded-tr-3xl rounded-bl-3xl bg-slate-300 rounded"></div>
                </div>
              </div>

              <div class="flexEnd ml-auto w-full animate-pulse flex space-x-4">
                <div class="w-64 space-y-2 py-1">
                  <div class="h-8 rounded-bl-3xl rounded-tl-3xl rounded-br-3xl bg-slate-300 rounded"></div>
                  <div
                    class="ml-auto w-3/4 h-8 rounded-bl-3xl rounded-tl-3xl rounded-br-3xl bg-slate-300 rounded"
                  ></div>
                </div>
                <div class="rounded-xl bg-slate-300 h-14 w-14"></div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <footer class="absolute bottom-0 left-0 py-[20px] px-[45px] bg-white w-full border-r-[2px] border-gray-200">
            <div class="flexCenter">
              <div class="flexCenter gap-3">
                <div
                  class="flexCenter rounded-full transition-all duration-300 ease-linear w-[42px] h-[42px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa] cursor-pointer"
                >
                  <Icon name="ri:file-gif-line" size="18px" />
                </div>

                <div
                  class="flexCenter rounded-full transition-all duration-300 ease-linear w-[42px] h-[42px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa] cursor-pointer"
                >
                  <Icon name="ph:smiley-bold" size="18px" />
                </div>

                <div
                  class="flexCenter rounded-full transition-all duration-300 ease-linear w-[42px] h-[42px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa] cursor-pointer"
                >
                  <Icon name="iconamoon:sign-plus-bold" size="24px" />
                </div>
              </div>

              <input
                id="send"
                type="text"
                placeholder="Write your message..."
                class="flex-1 h-[42px] pl-8 pr-4 outline-none text-lg bg-white text-title"
                v-model="message_content"
                @keyup.enter="sendMessage"
              />

              <div class="flexCenter gap-3">
                <div
                  class="flexCenter rounded-full transition-all duration-300 ease-linear w-[42px] h-[42px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa] cursor-pointer"
                >
                  <Icon name="mdi:microphone" size="20px" />
                </div>

                <div
                  class="flexCenter rounded-full transition-all duration-300 ease-linear w-[42px] h-[42px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa] cursor-pointer"
                  @click="sendMessage"
                >
                  <Icon name="icon-park-outline:send" size="18px" />
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>

    <div class="lg:block sm:hidden col-span-1 bg-feature_default w-full h-full">
      <FeatureList />
    </div>
  </div>
</template>
