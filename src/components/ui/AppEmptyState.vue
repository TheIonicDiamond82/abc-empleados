<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="px-4 py-12 text-center">
    <p class="text-sm font-medium text-ink-900">{{ title }}</p>
    <p v-if="description" class="mt-1 text-sm text-ink-500">{{ description }}</p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>
