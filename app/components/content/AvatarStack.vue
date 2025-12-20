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
  <div class="group flex items-center mb-8 w-26 h-26 relative cursor-pointer" @click="handleClick">
    <div class="size-26 left-1 rounded-full absolute shadow-md z-20">
      <NuxtImg :src="avatars[0]" alt="Avatar" class="w-full h-full rounded-full" height="128" width="128" format="avif" />
    </div>
    <div :class="[
      'rounded-full shadow-md absolute bottom-1 z-10 transition-all duration-150 ease-in-out',
      'size-24 left-8 group-hover:size-26 group-hover:left-22 group-hover:bottom-0',
      isActive && 'size-20 left-16'
    ]">
      <NuxtImg :src="avatars[1]" alt="Avatar" class="w-full h-full rounded-full" height="128" width="128" format="avif" />
    </div>
    <div :class="[
      'rounded-full shadow-md absolute bottom-2 z-0 transition-all duration-150 ease-in-out',
      'size-22 left-16 group-hover:size-26 group-hover:left-42 group-hover:bottom-0',
      isActive && 'size-20 left-32'
    ]">
      <NuxtImg :src="avatars[2]" alt="Avatar" class="w-full h-full rounded-full" height="128" width="128" format="avif" />
    </div>
  </div>
</template>
