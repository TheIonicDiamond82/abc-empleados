<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const { toasts } = storeToRefs(uiStore)
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto rounded-lg border bg-white px-4 py-3 shadow-sm"
      :class="{
        'border-emerald-200': toast.type === 'success',
        'border-red-200': toast.type === 'error',
      }"
    >
      <p class="text-sm font-medium text-ink-900">{{ toast.title }}</p>
      <p v-if="toast.message" class="mt-0.5 text-sm text-ink-500">{{ toast.message }}</p>
    </div>
  </div>
</template>
