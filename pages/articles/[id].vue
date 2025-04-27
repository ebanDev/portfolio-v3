<template>
  <div class="w-full px-4 py-4 mx-auto max-w-2xl">
    <NuxtLink to="/article"
      class="bg-purple-200 hover:bg-purple-500 hover:text-white transition flex items-center py-1 px-2 mb-4 w-max rounded-lg gap-1">
      <Icon name="tabler-arrow-left" />Accueil
    </NuxtLink>
    <h1 class="text-2xl sm:text-3xl md:!text-4xl font-bold mb-2" v-if="article">
      <Icon v-if="article.meta.icon" :name="article.meta.icon" class="mr-1 inline-block align-sub" />{{ article.title }}
    </h1>
    <span class="text-gray-500 text-sm mb-4" v-if="article">{{ article.meta.date }}</span>
    <span v-if="article && article.meta.initialLink" class="prose bg-purple-50 rounded-lg px-4 py-3 my-2 block">Article
      initialement
      écrit pour <span class="font-medium">{{ article.meta.initialPublisher }}</span> et disponible <NuxtLink
        :to="article.meta.initialLink" external class="inline-flex gap-1 items-center link font-medium align-middle">
        <Icon name="tabler-link" />ici
      </NuxtLink></span>
    <div class="w-lg max-w-full mx-auto mb-4" v-if="article">
      <img v-if="article.meta.coverDescription" :src="article.meta.cover" alt="Article image"
        class="rounded-lg max-h-[70vh] w-full object-cover" />
      <span v-if="article.meta.coverDescription" class="text-sm text-gray-500 italic text-center w-full mt-2 block">{{
        article.meta.coverDescription }}</span>
    </div>
    <ContentRenderer v-if="article" :value="article"
      class="prose prose-h1:text-2xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-pre:bg-purple-50 prose-p:text-justify" />
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
    @apply text-xl mt-8 font-bold mb-4;
  }

  img {
    @apply max-w-full max-h-[70vh] rounded-lg mx-auto;
  }
}
</style>
