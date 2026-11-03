<script setup>
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, required: true },
})

const emit = defineEmits(['change'])

function go(page) {
  if (page < 1 || page > props.totalPages || page === props.page) return
  emit('change', page)
}
</script>

<template>
  <div class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-ink-500">{{ totalItems }} registros</p>
    <div class="flex items-center gap-2">
      <AppButton variant="secondary" :disabled="page <= 1" @click="go(page - 1)">Anterior</AppButton>
      <span class="text-sm text-ink-700">{{ page }} / {{ totalPages }}</span>
      <AppButton variant="secondary" :disabled="page >= totalPages" @click="go(page + 1)">Siguiente</AppButton>
    </div>
  </div>
</template>
