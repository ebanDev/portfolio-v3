<script setup lang="ts">
const cardsData = ref([])

const props = defineProps({
  cards: {
    type: Array,
    required: false,
  },
  collection: {
    type: String,
    required: false,
  },
})

if (!props.cards && !props.collection) {
  throw new Error('Either "cards" or "collection" prop must be provided.')
} else if (props.cards && props.collection) {
  throw new Error('Only one of "cards" or "collection" prop must be provided.')
}


if (props.collection) {
  const { data: cards } = await useAsyncData(props.collection, () => {
    return queryCollection(props.collection).all()
  })

  cardsData.value = cards.value.map((card) => {
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      link: card.path,
      icon: card.meta.icon,
      date: card.meta.date,
    }
  }).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
} else {
  cardsData.value = props.cards
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
    <NuxtLink v-for="card in cardsData" class="flex flex-col group w-full" :key="card.id" :to="card.link">
      <div
        class="flex-1 bg-white border border-stone-400 hover:border-stone-600 rounded-sm py-3 px-4 flex flex-col justify-center">
        <h2 class="!text-base !text-gray-800 group-hover:!text-black !m-0"><Icon v-if="card.icon" :name="card.icon" class="!size-5 mr-1 inline-block align-sub" />{{ card.title }}</h2>
        <p class="text-sm text-gray-700 group-hover:text-gray-900 line-clamp-4">{{ card.description }}</p>
      </div>
    </NuxtLink>
  </div>
</template>
