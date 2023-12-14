<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
defineProps<{
  title?: string;
}>();
const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
</script>

<template>
  <VueFinalModal class="flex justify-center items-center">
    <form class="form">
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
        <input type="text" class="input" placeholder="Enter chatroom name" />
      </div>

      <div class="flex-column">
        <label>Add Members </label>
      </div>

      <div class="container">
        <div class="floating-stack">
          <div class="flexStart gap-4 px-3 py-1 bg-white hover:bg-[#e5edf5]">
            <div class="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/default-avata.webp" alt="Avatar.png" class="object-cover w-full h-full" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm text-title leading-5">Trung Nghia</h3>
              <span class="text-sm text-text">nghiakydiem@gmail.com</span>
            </div>
          </div>

          <div class="flexStart gap-4 px-3 py-1 bg-white hover:bg-[#e5edf5]">
            <div class="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/default-avata.webp" alt="Avatar.png" class="object-cover w-full h-full" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm text-title leading-5">Trung Nghia</h3>
              <span class="text-sm text-text">nghiakydiem@gmail.com</span>
            </div>
          </div>

          <div class="flexStart gap-4 px-3 py-1 bg-white hover:bg-[#e5edf5]">
            <div class="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/default-avata.webp" alt="Avatar.png" class="object-cover w-full h-full" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm text-title leading-5">Trung Nghia</h3>
              <span class="text-sm text-text">nghiakydiem@gmail.com</span>
            </div>
          </div>

          <div class="flexStart gap-4 px-3 py-1 bg-white hover:bg-[#e5edf5]">
            <div class="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/default-avata.webp" alt="Avatar.png" class="object-cover w-full h-full" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm text-title leading-5">Trung Nghia</h3>
              <span class="text-sm text-text">nghiakydiem@gmail.com</span>
            </div>
          </div>

          <div class="flexStart gap-4 px-3 py-1 bg-white hover:bg-[#e5edf5]">
            <div class="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/default-avata.webp" alt="Avatar.png" class="object-cover w-full h-full" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm text-title leading-5">Trung Nghia</h3>
              <span class="text-sm text-text">nghiakydiem@gmail.com</span>
            </div>
          </div>

          <div class="flexStart gap-4 px-3 py-1 bg-white hover:bg-[#e5edf5]">
            <div class="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/default-avata.webp" alt="Avatar.png" class="object-cover w-full h-full" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm text-title leading-5">Trung Nghia</h3>
              <span class="text-sm text-text">nghiakydiem@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flexCenter">
        <button class="button-submit transition-all duration-200 ease-linear hover:opacity-75">Create chatroom</button>
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

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.flex-row > div > label {
  font-size: 14px;
  color: black;
  font-weight: 400;
}

.button-submit {
  margin: 20px 0 10px 0;
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

.floating-stack {
  background: #fff;
  color: var(--system_title_color);
  height: 200px;
  width: 100%;
  border-radius: 10px;
  overflow-y: auto;
  border: 1.5px solid #ecedec;
  scroll-behavior: smooth;
}

.floating-stack > dl {
  margin: 0 0 1rem;
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  align-items: center;
}

.floating-stack dt {
  position: sticky;
  top: 0.5rem;
  left: 0.5rem;
  font-weight: bold;
  background: var(--system_primary_color);
  color: #fff;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  padding: 0.25rem 1rem;
  grid-column: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>
