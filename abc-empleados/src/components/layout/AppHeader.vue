<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const uiStore = useUiStore()
const title = computed(() => route.meta.title || 'ABC Empleados')
</script>

<template>
  <header class="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:px-8">
    <div class="flex items-center gap-3">
      <button
        class="rounded-md p-2 text-ink-700 hover:bg-ink-100 lg:hidden"
        type="button"
        aria-label="Abrir menú"
        @click="uiStore.toggleSidebar(true)"
      >
        <Menu class="size-5" />
      </button>
      <div>
        <h1 class="text-lg font-semibold text-ink-900">{{ title }}</h1>
        <p class="text-sm text-ink-500">{{ route.meta.description }}</p>
      </div>
    </div>
    <div class="hidden items-center gap-3 sm:flex">
      <div class="text-right">
        <p class="text-sm font-medium text-ink-900">Administrador</p>
        <p class="text-xs text-ink-500">Operaciones de personal</p>
      </div>
      <div class="flex size-9 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700">
        AD
      </div>
    </div>
  </header>
</template>
