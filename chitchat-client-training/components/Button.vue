<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: 'var(--button_default_width)',
  },
  height: {
    type: String,
    default: 'var(--button_default_height)',
  },
  size: {
    type: String,
    default: '20px',
  },
  primary: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
  iconName: {
    type: String,
    default: 'material-symbols-light:kid-star-sharp',
  },
  ping: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);
const handleClick = (e: Event) => {
  emit('click', e);
};
</script>

<template>
  <button
    class="relative rounded-full bg-button_secondary"
    :class="[
      {
        'text-btn_primary bg-btn_primary': primary,
      },
      { 'text-btn_secondary bg-btn_secondary': secondary },
    ]"
    :style="{ width, height }"
    @click="handleClick"
  >
    <div v-if="ping" class="container">
      <span class="heartbeat"></span>
      <span class="dot"></span>
    </div>
    <Icon :name="iconName" :size="size" />
  </button>
</template>

<style>
.dot {
  position: relative;
  width: fit-content;
  background: linear-gradient(135deg, #7932f6, #805ad5 48%, #342662);
  border-radius: 40px;
  width: 12px;
  height: 12px;
}

.heartbeat {
  position: absolute;
  width: fit-content;
  background-color: var(--system_error_color);
  border-radius: 40px;
  width: 6px;
  height: 6px;
  opacity: 0.75;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
