<script setup>
defineProps({
  tone: {
    type: String,
    default: 'neutral',
  },
})
</script>

<template>
  <span
    class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
    :class="{
      'bg-emerald-50 text-emerald-800': tone === 'success',
      'bg-amber-50 text-amber-800': tone === 'warning',
      'bg-red-50 text-red-800': tone === 'danger',
      'bg-ink-100 text-ink-700': tone === 'neutral',
    }"
  >
    <slot />
  </span>
</template>
