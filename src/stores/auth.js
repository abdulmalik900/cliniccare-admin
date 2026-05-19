import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('cc_auth') === 'true')

  const login = (username, password) => {
    if (username === 'malik' && password === '12345') {
      isAuthenticated.value = true
      localStorage.setItem('cc_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('cc_auth')
    router.push('/login')
  }

  return {
    isAuthenticated,
    login,
    logout
  }
})
