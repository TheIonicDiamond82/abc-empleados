<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
})

const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <label :for="id" class="block space-y-1.5">
    <span class="text-sm font-medium text-ink-700">{{ label }}</span>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="w-full rounded-md border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-accent"
      :class="error ? 'border-red-500' : 'border-ink-200'"
    />
    <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
  </label>
</template>
