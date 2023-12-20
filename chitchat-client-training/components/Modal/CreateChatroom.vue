<script setup lang="ts">
import type { User } from '~/types/common';
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
const search_value = ref<string>('');
const user_list = ref<User[]>([]);

const { users, isFetching } = userGetUsers();

watch(
  () => users.value,
  (value) => (user_list.value = value),
  { deep: true },
);
user_list.value = users.value.filter((user: User) => user.email !== user_email);

const handleAddToChatroom = () => {};

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
  <VueFinalModal class="flex justify-center items-center">
    <form class="form flex flex-col w-[500px] h-[540px] bg-white rounded-xl overflow-hidden">
      <div class="flexEnd ml-auto w-full h-6 mb-4">
        <div
          class="h-fit w-fit transition-all duration-200 ease-linear hover:rotate-90 cursor-pointer hover:opacity-75"
          @click="emit('confirm')"
        >
          <Icon name="material-symbols:close" class="text-3xl" />
        </div>
      </div>

      <div class="flex-column">
        <label>Chatroom name </label>
      </div>

      <div class="inputForm">
        <Icon name="mdi:rename-outline" class="text-xl" />
        <input
          type="text"
          class="input"
          placeholder="Enter chatroom name"
          v-model="search_value"
          @keyup="handleSearch"
        />
      </div>

      <div class="flex-column">
        <label>Add Members </label>
      </div>

      <div
        v-if="!isFetching"
        id="scrollbar"
        class="flex-1 w-full mt-3 transition-all duration-300 ease-out overflow-y-scroll"
      >
        <div
          v-for="user in user_list"
          id="user_item"
          class="relative flexBetween w-full h-fit py-[10px] border-primary border-solid lg:px-[30px] sm:px-[10px] cursor-pointer transition-all duration-200 ease-out hover:shadow-inner"
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
                    @click="handleAddChatroom(user.email)"
                  >
                    <Icon name="material-symbols:group-outline-rounded" class="mt-[1px]" />
                    <p class="text-xs text-current font-normal">Add to room</p>
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

      <div class="flexCenter">
        <button
          class="button-submit transition-all duration-200 ease-linear hover:opacity-75"
          @click="handleAddToChatroom"
        >
          Create chatroom
        </button>
      </div>
    </form>
  </VueFinalModal>
</template>

<style>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

.form button {
  align-self: flex-end;
}

.flex-column > label {
  color: #151717;
  font-weight: 600;
}

.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
}

.input {
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  width: 85%;
  height: 100%;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

.button-submit {
  margin-top: 10px;
  background-color: var(--system_primary_color);
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 40px;
  height: 40px;
  width: 50%;
  cursor: pointer;
  font-family: 'roboto';
}

.p {
  text-align: center;
  color: black;
  font-size: 14px;
  margin: 5px 0;
}

.btn {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  border: 1px solid #ededef;
  background-color: white;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.btn:hover {
  border: 1px solid #2d79f3;
}
</style>
