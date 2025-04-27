<template>
  <div class="min-h-screen overflow-x-hidden bg-[#f3eafa] dark:bg-stone-900 flex px-4 py-4 flex-row md:px-0 md:pt-12 md:pb-24 justify-center">
    <NuxtPage />
    <div class="fixed bottom-8"><ModeSwitcher @update:mode="updateMode" /></div>
  </div>
</template>

<script setup lang="ts">
const updateMode = (newMode: string) => {
  if (newMode === 'terminal') {
    navigateTo('https://terminal.eban.eu.org', { external: true })
  } else {
    navigateTo('/'+newMode)
  }
}

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/avatar-1.jpeg',
    },
  ],
})
</script>
