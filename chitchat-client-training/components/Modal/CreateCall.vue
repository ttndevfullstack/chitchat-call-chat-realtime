<script setup lang="ts">
import type { User } from '@/types/common';
import { useToast } from 'vue-toastification';
import { VueFinalModal } from 'vue-final-modal';
import userGetUsers from '@/composables/use-get-users';

defineProps<{
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
const { data }: { data: any } = useAuth();
const user_email = data?.value?.user?.email;
const user_list = ref<User[]>([]);
const search_value = ref<string>('');

const { users, isFetching } = userGetUsers();

watch(
  () => users.value,
  (value) => (user_list.value = value),
  { deep: true },
);
user_list.value = users.value.filter((user: User) => user.email !== user_email);

const handleCall = (friend_email: string) => {};

const handleSearch = () => {
  const searchText = search_value.value.toLowerCase().trim();

  if (!searchText) {
    user_list.value = users.value;
  } else {
    user_list.value = users.value.filter((user: User) => user.email.includes(searchText));
  }
};
</script>

<template>
  <VueFinalModal class="flexCenter">
    <div class="flexCenter w-full h-screen">
      <section class="flex flex-col w-[500px] h-[540px] bg-white rounded-xl overflow-hidden">
        <header class="relative w-full text-left bg-[#ddf0fc] px-8 py-5 text-primary">
          <p class="text-primary text-2xl font-bold">Create New Call</p>
          <div class="absolute flexCenter top-[-77px] right-[-75px] w-[150px] h-[150px] bg-primary rounded-full">
            <div
              class="absolute bottom-6 left-8 h-fit w-fit transition-all duration-200 ease-linear hover:rotate-90 cursor-pointer"
              @click="emit('confirm')"
            >
              <Icon name="material-symbols:close" class="text-white text-[30px]" />
            </div>
          </div>
        </header>

        <main class="flex flex-col py-[25px] px-[35px] w-full h-5/6">
          <div class="flex w-full h-[40px]">
            <input
              type="text"
              placeholder="Enter your friend name..."
              class="py-2 px-3 w-full h-full border-[1px] border-gray-300 outline-none"
              v-model="search_value"
              @keyup="handleSearch"
            />
            <div class="flexCenter w-[50px] h-full bg-button_secondary text-btn_secondary">
              <Icon name="ph:magnifying-glass-bold" size="18px" />
            </div>
          </div>

          <div
            v-if="!isFetching"
            id="scrollbar"
            class="flex-1 w-full mt-3 transition-all duration-300 ease-out overflow-y-scroll"
          >
            <div
              v-for="user in user_list"
              id="user_item"
              class="relative flexBetween w-full h-fit py-[10px] border-primary border-solid lg:px-[30px] xs:px-[10px] cursor-pointer transition-all duration-200 ease-out hover:shadow-inner"
            >
              <div id="pin" class="absolute top-0 right-9 transition-all duration-200 ease-linear">
                <Icon name="eos-icons:push-pin-outlined" class="text-text" />
              </div>

              <div class="flex gap-4">
                <div class="relative w-[50px] h-[50px] rounded-2xl">
                  <NuxtImg
                    :src="user?.avatar ? user?.avatar : '/default-avata.webp'"
                    alt="Avatar.png"
                    class="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <h5>{{ user?.email }}</h5>
                  <div class="w-full h-full">
                    <div class="flex w-fit h-full mr-auto">
                      <div
                        class="flexCenter gap-1 h-fit w-fit px-2 py-1 text-[#3fcc35] bg-[#e2f7e1] hover:bg-[#cff2cc] cursor-pointer rounded-full"
                        @click="handleCall(user.email)"
                      >
                        <Icon name="ph:phone" class="mt-[1px]" />
                        <p class="text-xs text-current font-normal">Call video</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex-1 w-full mt-3 transition-all duration-300 ease-out">
            <Fetching />
          </div>
        </main>
      </section>
    </div>
  </VueFinalModal>
</template>
