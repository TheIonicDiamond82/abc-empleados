import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

let toastId = 0

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const toasts = ref([])
  const confirmState = ref({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    tone: 'danger',
    resolve: null,
  })

  const hasOpenConfirm = computed(() => confirmState.value.open)

  function toggleSidebar(force) {
    sidebarOpen.value = typeof force === 'boolean' ? force : !sidebarOpen.value
  }

  function notify({ title, message, type = 'success' }) {
    const id = ++toastId
    toasts.value.push({ id, title, message, type })
    window.setTimeout(() => dismissToast(id), 4200)
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function confirm({ title, message, confirmLabel = 'Confirmar', tone = 'danger' }) {
    return new Promise((resolve) => {
      confirmState.value = {
        open: true,
        title,
        message,
        confirmLabel,
        tone,
        resolve,
      }
    })
  }

  function settleConfirm(accepted) {
    confirmState.value.resolve?.(accepted)
    confirmState.value = {
      ...confirmState.value,
      open: false,
      resolve: null,
    }
  }

  return {
    sidebarOpen,
    toasts,
    confirmState,
    hasOpenConfirm,
    toggleSidebar,
    notify,
    dismissToast,
    confirm,
    settleConfirm,
  }
})
