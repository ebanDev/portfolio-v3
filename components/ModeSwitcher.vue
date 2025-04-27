<script setup lang="ts">
const emit = defineEmits(['update:mode'])

// — Config & helpers —
const modes = [
  { name: 'ph:article-ny-times-bold', id: 'article' },
  { name: 'ph:graph-bold', id: 'graph'},
  { name: 'ph:chats-teardrop-bold', id: 'chats'},
  { name: 'ph:terminal-bold', id: 'terminal' },
]
const C = { icon: 24, gap: 16, pad: 8, sq: 32 }
const step = C.icon + C.gap
const base = C.pad + (C.icon - C.sq) / 2

// — Reactive state —
const box = ref<HTMLElement | null>(null)
const idx  = ref(0)
watch(idx, (newVal) => emit('update:mode', modes[newVal].id))
const drag = ref({ on: false, start: 0, x: 0 })

// — Derived transforms —
const pos  = computed(() => drag.value.on ? drag.value.x : base + idx.value * step)
const prog = computed(() => Math.min(Math.abs(pos.value - (base + idx.value * step)) / (step * .6), 1))
const tf   = computed(() =>
  `translateX(${pos.value}px) scaleX(${1 + prog.value * .6}) scaleY(${1 - prog.value * .3})`)

// — Utils —
const localX   = (e: PointerEvent) => e.clientX - (box.value?.getBoundingClientRect().left || 0)
const clampIdx = (n:number)       => Math.min(modes.length - 1, Math.max(0, n))
const nearest  = (x:number)       => clampIdx(Math.round((x - base) / step))

// — Pointer handlers —
const down = (e:PointerEvent) => {
  drag.value = { on: true, start: localX(e), x: base + idx.value * step }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

const move = (e:PointerEvent) => {
  if (!drag.value.on) return
  const delta = localX(e) - drag.value.start
  const res   = Math.sign(delta) * Math.max(0, Math.abs(delta) - step * .45) // resistance
  drag.value.x = Math.min(base + (modes.length - 1) * step, Math.max(base, base + idx.value * step + res))

  if (Math.abs(drag.value.x - (base + idx.value * step)) > step * .65) {
    idx.value = clampIdx(nearest(drag.value.x))
    drag.value.start = localX(e)
  }
}

const up = (e:PointerEvent) => {
  drag.value.on = false
  drag.value.x  = base + idx.value * step
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
}

// — Click shortcut with rubber‑band —
const jump = (i:number) => {
  if (i === idx.value) return

  const from = base + idx.value * step
  const to   = base + i * step
  const mid  = (from + to) / 2

  drag.value = { ...drag.value, on: true, x: from }
  idx.value  = i

  requestAnimationFrame(() => {
    drag.value.x = mid
    setTimeout(() => {
      drag.value.x = to
      setTimeout(() => (drag.value.on = false), 20)
    }, 75)
  })
}
</script>

<template>
  <div ref="box" class="relative select-none flex items-center gap-4 p-3 bg-white shadow-lg rounded-xl">
    <!-- Icons -->
    <Icon v-for="(m,i) in modes" :key="m.id" :name="m.name"
      :class="['w-6 h-6 text-2xl z-10 transition-colors duration-100 cursor-pointer text-white mix-blend-difference', i===idx ? 'pointer-events-none' : '']"
      @click="jump(i)" />

    <!-- Square -->
    <div
      class="absolute top-2 left-1 h-8 bg-black dark:bg-gray-200 rounded-lg transition-[transform] duration-200 ease-[cubic-bezier(0.445,0.05,0.55,0.95)]"
      :style="{ transform: tf, width: `${C.sq}px` }"
      :class="drag.on ? 'cursor-grabbing' : 'cursor-grab'"
      @pointerdown="down" @pointermove="move" @pointerup="up" />
  </div>
</template>
