<template>
  <div class="pt-8">
    <UApp>
      <NuxtPage />
      <div
        v-if="cursorEnabled"
        class="site-cursor"
        :class="{ 'is-visible': cursorVisible }"
        :style="{ '--cursor-x': `${cursorX}px`, '--cursor-y': `${cursorY}px` }"
        aria-hidden="true"
      >
        <svg class="site-cursor-svg" :viewBox="cursorViewBox" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <path
            class="site-cursor-path"
            :d="cursorPath"
            :fill="cursorFill"
            :stroke="cursorStroke"
            :stroke-width="cursorStrokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
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
import { interpolate } from 'flubber';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { BASE_CURSOR, SELECTED_CURSOR } from './utils/cursorData';

const basePathData = BASE_CURSOR.path;
const selectedPathData = SELECTED_CURSOR.path;

const baseFill = BASE_CURSOR.fill;
const selectedFill = SELECTED_CURSOR.fill;
const baseStroke = BASE_CURSOR.stroke;
const selectedStroke = SELECTED_CURSOR.stroke;
const baseStrokeWidth = BASE_CURSOR.strokeWidth;
const selectedStrokeWidth = SELECTED_CURSOR.strokeWidth;

const cursorEnabled = ref(false);
const cursorVisible = ref(false);
const cursorX = ref(-100);
const cursorY = ref(-100);
const cursorPath = ref(basePathData);
const cursorViewBox = SELECTED_CURSOR.viewBox;
const cursorFill = ref(baseFill);
const cursorStroke = ref(baseStroke);
const cursorStrokeWidth = ref(baseStrokeWidth);

let handleMouseOut: ((event: MouseEvent) => void) | undefined;
let morphInterpolator: ((progress: number) => string) | null = null;
let rafId: number | undefined;
let morphTarget = 0;
let cursorProgress = 0;
let isSelectedState = false;

const pointerSelector = 'a[href], button, input, textarea, select, summary, label, [role="button"], .cursor-pointer';

const isPointerLike = (element: Element | null) => {
  return Boolean(element?.closest(pointerSelector));
};

const baseFillRgb = { r: 121, g: 140, b: 90 };
const selectedFillRgb = { r: 86, g: 100, b: 63 };
const baseStrokeRgb = { r: 121, g: 140, b: 90 };
const selectedStrokeRgb = { r: 86, g: 100, b: 63 };

const mixHex = (
  from: { r: number; g: number; b: number },
  to: { r: number; g: number; b: number },
  t: number,
) => {
  const mixChannel = (fromValue: number, toValue: number) => Math.round(fromValue + (toValue - fromValue) * t)
    .toString(16)
    .padStart(2, '0');

  return `#${mixChannel(from.r, to.r)}${mixChannel(from.g, to.g)}${mixChannel(from.b, to.b)}`;
};

const applyMorphFrame = () => {
  if (morphInterpolator) {
    cursorPath.value = morphInterpolator(cursorProgress);
  } else {
    cursorPath.value = morphTarget >= 0.5 ? selectedPathData : basePathData;
  }

  cursorFill.value = mixHex(baseFillRgb, selectedFillRgb, cursorProgress);
  cursorStroke.value = mixHex(baseStrokeRgb, selectedStrokeRgb, cursorProgress);
  cursorStrokeWidth.value = baseStrokeWidth + (selectedStrokeWidth - baseStrokeWidth) * cursorProgress;
};

const animateMorph = () => {
  cursorProgress += (morphTarget - cursorProgress) * 0.24;
  if (Math.abs(morphTarget - cursorProgress) < 0.002) {
    cursorProgress = morphTarget;
  }

  applyMorphFrame();

  if (cursorProgress === morphTarget) {
    rafId = undefined;
    return;
  }

  rafId = window.requestAnimationFrame(animateMorph);
};

const queueMorph = (target: number) => {
  morphTarget = target;
  if (!rafId) {
    rafId = window.requestAnimationFrame(animateMorph);
  }
};

const updateCursor = (event: PointerEvent) => {
  cursorX.value = event.clientX;
  cursorY.value = event.clientY;
  cursorVisible.value = true;

  const nextSelected = isPointerLike(event.target instanceof Element ? event.target : null);
  if (nextSelected !== isSelectedState) {
    isSelectedState = nextSelected;
    queueMorph(nextSelected ? 1 : 0);
  }
};

const hideCursor = () => {
  cursorVisible.value = false;
};

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  cursorEnabled.value = true;
  document.documentElement.classList.add('has-custom-cursor');

  if (basePathData && selectedPathData) {
    try {
      morphInterpolator = interpolate(basePathData, selectedPathData, {
        maxSegmentLength: 2,
      });
    } catch {
      morphInterpolator = null;
    }
  }
  applyMorphFrame();

  window.addEventListener('pointermove', updateCursor, { passive: true });
  handleMouseOut = (event) => {
    if (!event.relatedTarget) {
      hideCursor();
    }
  };
  document.addEventListener('mouseout', handleMouseOut);
  window.addEventListener('blur', hideCursor);
});

onBeforeUnmount(() => {
  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }
  window.removeEventListener('pointermove', updateCursor);
  if (handleMouseOut) {
    document.removeEventListener('mouseout', handleMouseOut);
  }
  window.removeEventListener('blur', hideCursor);
  document.documentElement.classList.remove('has-custom-cursor');
});

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
