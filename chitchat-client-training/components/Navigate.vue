<script lang="ts" setup>
const { signOut } = useAuth();
</script>

<template>
  <nav id="scrollbar" class="h-screen w-nav bg-nav_default flex flex-col overflow-y-scroll">
    <div class="flexCenter w-full h-[114px] border-b-[1px] border-gray-200">
      <img src="~/public/logo2.png" alt="logo.png" />
    </div>

    <div class="flexCenter w-full h-24">
      <div class="w-[43px] h-[43px] rounded-full border-[3px] border-primary overflow-hidden">
        <img src="~/public/default-avata.webp" alt="avatar.png" />
      </div>
    </div>

    <div class="flexCenter flex-col gap-4 w-full h-fit">
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button style="secondary" icon-name="ic:outline-star" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button style="secondary" icon-name="material-symbols:unknown-document-outline" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button style="secondary" icon-name="material-symbols:group-add-rounded" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button style="secondary" icon-name="ic:baseline-notifications" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button style="secondary" icon-name="material-symbols:settings" size="17px" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12">
        <Button style="secondary" icon-name="ph:moon-light" />
      </div>
      <div class="flexCenter flex-col gap-4 w-full h-12" @click="() => signOut()">
        <Button style="secondary" icon-name="ri:shut-down-line" size="17px" />
      </div>
    </div>
  </nav>
</template>
