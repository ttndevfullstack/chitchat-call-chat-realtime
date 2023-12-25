<script lang="ts" setup></script>

<template>
  <div class="bg-white shadow-xl border-[1px] border-gray-200 rounded-md transition-all duration-500 ease-out">
    <ul>
      <li class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear" @click="">
        <div class="flexStart px-4 gap-3">
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-title bg-transparent cursor-pointer"
          >
            <Icon name="ic:baseline-person-outline" size="18px" />
          </button>
          <h1 class="text-sm font-normal text-title">Profile</h1>
        </div>
      </li>

      <li
        class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear"
        @click="$deleteChatroom.$emit('delete:message')"
      >
        <div class="flexStart px-4 gap-3">
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-title bg-transparent cursor-pointer"
          >
            <Icon name="material-symbols-light:delete-outline-rounded" size="20px" />
          </button>
          <h1 class="text-sm font-normal text-title">Delete</h1>
        </div>
      </li>

      <li class="py-2 px-2 hover:bg-chatroom_default cursor-pointer transition-all duration-200 ease-linear" @click="">
        <div class="flexStart px-4 gap-3">
          <button
            class="flexCenter rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-title bg-transparent cursor-pointer"
          >
            <Icon name="ri:forbid-line" size="18px" />
          </button>
          <h1 class="text-sm font-normal text-title">Block</h1>
        </div>
      </li>
    </ul>
  </div>
</template>
