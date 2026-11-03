<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: '' },
  placeholder: { type: String, default: 'Seleccionar' },
  options: { type: Array, default: () => [] },
})

defineEmits(['change'])
const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <label :for="id" class="block space-y-1.5">
    <span class="text-sm font-medium text-ink-700">{{ label }}</span>
    <select
      :id="id"
      v-model="model"
      class="w-full rounded-md border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-accent"
      :class="error ? 'border-red-500' : 'border-ink-200'"
      @change="$emit('change')"
    >
      <option value="">{{ placeholder }}</option>
      <slot>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </slot>
    </select>
    <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
  </label>
</template>
