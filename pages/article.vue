<template>
  <div class="w-full px-4 py-4 mx-auto max-w-2xl">
    <ContentRenderer v-if="article" :value="article" />
    <div v-else>Article not found</div>
  </div>
</template>

<script setup lang="ts">
const { data: article } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: article.value?.title,
  description: article.value?.description
})
</script>

<style>
@reference "tailwindcss";

b,
strong {
  @apply font-bold;
}

p>a {
  @apply underline underline-offset-4 hover:underline-offset-2 hover:text-black hover:font-medium transition-all duration-150;
}


h2 {
  @apply text-xl mt-8 font-bold mb-4;
}
</style>
