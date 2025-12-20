<script setup lang="ts">
import { card } from '#build/ui'
import type { Collections } from '@nuxt/content'

interface Card {
  id: string
  title: string
  description: string
  link: string
  icon?: string
  date: string
}

type CollectionKey = Extract<keyof Collections, string>
type CollectionItem = Collections[CollectionKey]
type CollectionMeta = {
  icon?: string
  date?: string
}

const cardsData = ref<Card[]>([])

const props = defineProps<{
  cards?: Card[]
  collection?: CollectionKey
}>()

if (!props.cards && !props.collection) {
  throw new Error('Either "cards" or "collection" prop must be provided.')
} else if (props.cards && props.collection) {
  throw new Error('Only one of "cards" or "collection" prop must be provided.')
}


if (props.collection) {
  const collectionKey = props.collection
  const { data: cards } = await useAsyncData<CollectionItem[]>(collectionKey, () => {
    return queryCollection(collectionKey).all()
  })

  const collectionCards = cards.value ?? []
  cardsData.value = collectionCards
    .map((card) => {
      const meta = card.meta as CollectionMeta
      return {
        id: card.id,
        title: card.title,
        description: card.description,
        link: card.path,
        icon: meta.icon,
        date: meta.date ?? '',
      }
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
} else {
  cardsData.value = props.cards || []
}
</script>

<template>
  <UPageGrid>
    <UPageCard v-for="card in cardsData" 
      :title="card.title"
      :to="card.link"
      target="_blank"
      :icon="card.icon"
      :description="card.description"
      :key="card.id"
      :ui="{ description: 'line-clamp-3' }"
    />
  </UPageGrid>
</template>
