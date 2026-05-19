import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const toasts = ref([]) // {id, type, message}

  const toggleSidebar = () => (sidebarCollapsed.value = !sidebarCollapsed.value)

  let tid = 1
  const addToast = (message, type = 'success', duration = 2800) => {
    const id = tid++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  return { sidebarCollapsed, toasts, toggleSidebar, addToast }
})
