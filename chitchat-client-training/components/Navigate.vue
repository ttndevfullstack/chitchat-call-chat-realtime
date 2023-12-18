<script lang="ts" setup>
import 'tippy.js/dist/tippy.css';
import { Tippy } from 'vue-tippy';

const { signOut } = useAuth();
</script>

<template>
  <nav
    class="h-full w-full bg-nav_default flex flex-col border-r-4 border-[#d6eaf7] transition-all duration-300 ease-linear"
  >
    <NuxtLink to="/" class="flexCenter w-full h-[114px] border-b-[1px] border-gray-200 cursor-pointer">
      <img src="/logo2.png" alt="logo.png" />
    </NuxtLink>

    <div class="flexCenter w-full h-24">
      <tippy placement="top" animation theme="dark">
        <div class="w-[43px] h-[43px] rounded-full border-[3px] border-primary overflow-hidden">
          <img src="/default-avata.webp" alt="avatar.png" />
        </div>

        <template #content>
          <div class="py-1">Status</div>
        </template>
      </tippy>
    </div>

    <div class="flexCenter flex-col gap-4 w-full h-fit">
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button content="Favourite" style="secondary" icon-name="ic:outline-star" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button content="Document" style="secondary" icon-name="material-symbols:unknown-document-outline" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button content="Contact List" style="secondary" icon-name="material-symbols:group-add-rounded" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button content="Notification" style="secondary" icon-name="ic:baseline-notifications" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button content="Setting" style="secondary" icon-name="material-symbols:settings" size="17px" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button content="Theme Mode" style="secondary" icon-name="ph:moon-light" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12" @click="() => signOut()">
        <Button content="Sign out" style="secondary" icon-name="ri:shut-down-line" size="17px" />
      </div>
    </div>
  </nav>
</template>
