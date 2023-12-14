<template>
  <nav class="h-full w-full bg-nav_default flex flex-col border-r-4 border-[#d6eaf7]">
    <div
      class="flexCenter flex-col gap-1 w-full h-[90px] border-b-[1px] border-gray-200 cursor-pointer hover:opacity-75"
    >
      <Icon name="iconoir:view-grid" size="28px" class="text-primary" />
      <h5 class="opacity-70">Apps</h5>
    </div>

    <div class="flexCenter flex-col gap-5 w-full h-fit mt-6">
      <div class="flexCenter flex-col gap-2 w-fit h-fit">
        <button
          class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-[#3fcc35] bg-[#e2f7e1] hover:bg-[#cff2cc]"
        >
          <Icon name="material-symbols:edit-document-outline" size="18px" />
        </button>
        <h5 class="opacity-70">Files</h5>
      </div>

      <div class="flexCenter flex-col gap-2 w-fit h-fit">
        <button
          class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] text-primary bg-[#ddf0fc] hover:bg-[#c6e6fa]"
        >
          <Icon name="material-symbols:phone-android-outline" size="18px" />
        </button>
        <h5 class="opacity-70">Notes</h5>
      </div>

      <div class="flexCenter flex-col gap-2 w-fit h-fit">
        <button
          class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-[#ffe5df] text-error hover:bg-[#ffd3ca]"
        >
          <Icon name="material-symbols-light:lists" size="18px" />
        </button>
        <h5 class="opacity-70">Todo</h5>
      </div>

      <div class="flexCenter flex-col gap-2 w-fit h-fit">
        <button
          class="rounded-full transition-all duration-300 ease-linear w-[34px] h-[34px] bg-[#fff6dc] text-warn hover:bg-[#fff0c4]"
        >
          <Icon name="fluent-emoji-high-contrast:two-oclock" size="18px" />
        </button>
        <h5 class="opacity-70">Reminder</h5>
      </div>
    </div>

    <div class="fixed bottom-2 right-[36px] flex flex-col gap-2">
      <div class="flexCenter w-[42px] h-[42px] rounded-full bg-primary text-white hover:bg-[#1280c1] cursor-pointer">
        <p class="uppercase font-medium text-sm">RTC</p>
      </div>
      <div class="flexCenter w-[42px] h-[42px] rounded-full bg-accent text-white hover:bg-[#32a42a] cursor-pointer">
        <Icon name="material-symbols:settings" class="animate-spin" size="18px" />
      </div>
      <div>
        <div
          class="flexCenter w-[42px] h-[42px] rounded-full bg-error text-white mt-6 hover:bg-[#f72900] cursor-pointer"
        >
          <Icon name="material-symbols:close-rounded" size="19px" />
        </div>
        <h5 class="opacity-70 mt-2">Close</h5>
      </div>
    </div>
  </nav>
</template>
