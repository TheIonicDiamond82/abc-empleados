<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-accent text-white hover:bg-accent-hover': variant === 'primary',
      'border border-ink-200 bg-white text-ink-900 hover:bg-ink-100': variant === 'secondary',
      'bg-red-700 text-white hover:bg-red-800': variant === 'danger',
      'text-ink-700 hover:bg-ink-100': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
