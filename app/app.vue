import { UFooter, UButton } from '../.nuxt/content/components';
<template>
  <div class="pt-8">
    <UApp>
      <NuxtPage />
      <UFooter>
        <template #left>
          <p class="text-sm text-gray-500">🄯 {{ new Date().getFullYear() }} Eban Rami. No rights reserved, content
            released under AGPL-3.0 🍓.</p>
        </template>
        <template #right>
          <UTooltip text="Github">
            <UButton icon="ph:github-logo-bold" color="neutral" variant="subtle" to="https://github.com/ebanDev"
              target="_blank" aria-label="GitHub profile" />
          </UTooltip>
          <UTooltip text="Email">
            <UButton icon="ph:envelope-bold" color="neutral" variant="subtle" to="mailto:rami@eban.eu.org"
              target="_blank" aria-label="Email" />
          </UTooltip>
          <UTooltip text="GPG">
            <UButton icon="ph:key-bold" color="neutral" variant="subtle"
              to="https://keys.openpgp.org/vks/v1/by-fingerprint/60FE4D8C912EFDC5E37AD02EE56015D56B08FDBC"
              target="_blank" aria-label="Keybase profile" />
          </UTooltip>
          <UTooltip text="LinkedIn">
            <UButton icon="ph:linkedin-logo-bold" color="neutral" variant="subtle"
              to="https://linkedin.com/in/eban-rami" target="_blank" aria-label="LinkedIn profile" />
          </UTooltip>
        </template>
      </UFooter>
    </UApp>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/avatar-2.jpg',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'description',
      content: "Welcome to my corner of the internet 🌱. I'm Eban Rami, I like crafting empowering experiences through code. On this website, you'll find projects I've worked on, articles I've written, and a few other things.",
    },
  ],
})
</script>
