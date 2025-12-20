<template>
  <div class="w-full px-4 py-4 mx-auto max-w-2xl">
    <UButton to="/article" color="violet" variant="soft" class="mb-4" size="sm">
      <Icon name="ph:arrow-left-bold" class="size-4" />
      <span>Accueil</span>
    </UButton>
    <h1 class="text-2xl sm:text-3xl md:!text-4xl font-bold mb-2" v-if="article">
      <Icon v-if="article.meta.icon" :name="article.meta.icon" class="mr-2 inline-block align-sub" />{{ article.title }}
    </h1>
    <span class="text-gray-500 text-sm mb-4" v-if="article">{{ article.meta.date }}</span>
    <UAlert v-if="article && article.meta.initialLink" class="my-6" color="secondary" variant="subtle"
      orientation="horizontal" :title="'Article initialement publié et écrit pour ' + article.meta.initialPublisher"
      :actions="[{ label: 'Voir l\'original', leadingIcon: 'ph:arrow-square-out-bold', to: article.meta.initialLink, target: '_blank' }]">
    </UAlert>
    <div class="w-lg max-w-full mx-auto mb-4" v-if="article">
      <img v-if="article.meta.coverDescription" :src="article.meta.cover" alt="Article image"
        class="rounded-lg max-h-[70vh] w-full object-cover" />
      <span v-if="article.meta.coverDescription" class="text-sm text-gray-500 italic text-center w-full mt-2 block">{{
        article.meta.coverDescription }}</span>
    </div>
    <ContentRenderer v-if="article" :value="article"
      class="max-w-none w-full prose prose-h1:text-2xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-pretty prose-pre:text-highlighted" />
    <div v-else>Article not found</div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: article } = await useAsyncData(route.path, () => {
  return queryCollection('articles').path(route.path).first()
})

useHead({
  title: article.value?.title,
  description: article.value?.description,
})
</script>

<style>
@reference "tailwindcss";

.prose {

  b,
  strong {
    @apply font-bold;
  }

  p>a,
  li>a,
  .link {
    @apply underline underline-offset-4 hover:underline-offset-2 hover:text-black hover:font-medium transition-all duration-150;
  }


  h2 {
    @apply mt-8 font-bold mb-4;
  }

  img {
    @apply max-w-full max-h-[70vh] rounded-lg mx-auto;
  }
}
</style>
