<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'
import AppToastStack from '@/components/ui/AppToastStack.vue'

const uiStore = useUiStore()
const { sidebarOpen } = storeToRefs(uiStore)
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <AppSidebar />
    </div>

    <div v-if="sidebarOpen" class="fixed inset-0 z-30 lg:hidden">
      <button class="absolute inset-0 bg-ink-950/40" type="button" @click="uiStore.toggleSidebar(false)" />
      <div class="relative h-full w-64">
        <AppSidebar />
      </div>
    </div>

    <div class="lg:pl-64">
      <AppHeader />
      <main class="px-4 py-6 lg:px-8">
        <RouterView />
      </main>
    </div>

    <AppConfirmDialog />
    <AppToastStack />
  </div>
</template>
