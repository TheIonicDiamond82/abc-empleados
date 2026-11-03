<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
})
</script>

<template>
  <article class="rounded-xl border border-ink-200 bg-white p-5">
    <p class="text-sm text-ink-500">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold tracking-tight text-ink-900">{{ value }}</p>
    <p v-if="hint" class="mt-2 text-xs text-ink-500">{{ hint }}</p>
  </article>
</template>
