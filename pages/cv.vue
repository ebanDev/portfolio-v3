<template>
  <div class="cv-page">
    <div class="cv-content">
      <h1>404</h1>
      <p>The page you are looking for could not be found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

if (import.meta.server) {
  const event = useRequestEvent()
  if (event) {
    event.node.res.statusCode = 404
    event.node.res.statusMessage = 'Not Found'
  }
}

const hasSentFingerprint = ref(false)

async function captureFingerprint() {
  if (hasSentFingerprint.value) {
    return
  }

  try {
    const agent = await FingerprintJS.load()
    const result = await agent.get()

    const components = Object.fromEntries(
      Object.entries(result.components || {}).map(([key, component]) => {
        const value = component && typeof component === 'object' && 'value' in component ? component.value : null
        const duration = component && typeof component === 'object' && 'duration' in component ? component.duration : null
        return [key, { value, duration }]
      })
    )

    const payload = {
      fingerprint: {
        visitorId: result.visitorId,
        confidence: result.confidence,
        components,
        requestId: result.requestId ?? null,
        timing: result.timing ?? null,
        version: (FingerprintJS as any)?.version ?? null
      },
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen?.width ?? null,
        height: window.screen?.height ?? null,
        colorDepth: window.screen?.colorDepth ?? null
      },
      referrer: document.referrer || null
    }

    await fetch('/api/cv/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    })

    hasSentFingerprint.value = true
  } catch (error) {
    console.error('Failed to capture fingerprint for /cv', error)
  }
}

onMounted(() => {
  if (import.meta.client) {
    void captureFingerprint()
  }
})

useHead({
  title: '404 Not Found',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.cv-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  color: #e2e8f0;
  text-align: center;
  padding: 2rem;
}

.cv-content h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.cv-content p {
  opacity: 0.7;
  margin: 0;
}
</style>
