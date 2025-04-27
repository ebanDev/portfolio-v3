<script setup lang="ts">
import { ref } from 'vue'
const { avatars } = defineProps<{ avatars: string[] }>()
const isActive = ref(false)
function handleClick(): void {
  isActive.value = true
  setTimeout(() => { isActive.value = false }, 500)
}
</script>

<template>
  <div class="group flex items-center mb-6 w-26 h-20 relative cursor-pointer" @click="handleClick">
    <div class="size-20 left-1 rounded-full absolute shadow-md z-20">
      <img :src="avatars[0]" alt="Avatar" class="w-full h-full rounded-full" />
    </div>
    <div :class="[
      'rounded-full shadow-md absolute bottom-0 z-10 transition-all duration-150 ease-in-out',
      'size-18 left-5 group-hover:size-20 group-hover:left-16',
      isActive && 'size-20 left-16'
    ]">
      <img :src="avatars[1]" alt="Avatar" class="w-full h-full rounded-full" />
    </div>
    <div :class="[
      'rounded-full shadow-md absolute bottom-0 z-0 transition-all duration-150 ease-in-out',
      'size-16 left-9 group-hover:size-20 group-hover:left-32',
      isActive && 'size-20 left-32'
    ]">
      <img :src="avatars[2]" alt="Avatar" class="w-full h-full rounded-full" />
    </div>
  </div>
</template>
