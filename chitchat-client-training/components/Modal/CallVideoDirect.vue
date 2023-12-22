<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
const { data }: { data: any } = useAuth();
const user_email = data.value.user?.email;
</script>

<template>
  <VueFinalModal class="flexCenter">
    <section class="flexCenter w-screen h-screen">
      <div class="w-[80%] h-[85%] bg-black">
        <NuxtImg
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrVpA8owKKiTgnl8kyLzEXoLZ79mvfTO6fyw&usqp=CAU"
          class="w-full h-full object-cover"
        />
      </div>
    </section>
  </VueFinalModal>
</template>
