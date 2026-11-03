<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})

const emit = defineEmits(['close'])

function onBackdrop(event) {
  if (event.target === event.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-4 py-10"
      @click="onBackdrop"
    >
      <div class="w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-ink-900">{{ title }}</h2>
            <p v-if="subtitle" class="mt-1 text-sm text-ink-500">{{ subtitle }}</p>
          </div>
          <button class="text-sm text-ink-500 hover:text-ink-900" type="button" @click="emit('close')">
            Cerrar
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
