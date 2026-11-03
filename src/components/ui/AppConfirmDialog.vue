<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import AppButton from '@/components/ui/AppButton.vue'

const uiStore = useUiStore()
const { confirmState } = storeToRefs(uiStore)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="confirmState.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 px-4"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-6">
        <h2 class="text-lg font-semibold text-ink-900">{{ confirmState.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-ink-500">{{ confirmState.message }}</p>
        <div class="mt-6 flex justify-end gap-2">
          <AppButton variant="secondary" @click="uiStore.settleConfirm(false)">Cancelar</AppButton>
          <AppButton
            :variant="confirmState.tone === 'danger' ? 'danger' : 'primary'"
            @click="uiStore.settleConfirm(true)"
          >
            {{ confirmState.confirmLabel }}
          </AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
