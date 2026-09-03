import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || null)
  const profile = ref(null)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearToken = () => {
    token.value = null
    profile.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => !!token.value

  const fetchProfile = async () => {
    if (!token.value) {
      profile.value = null
      return
    }
    try {
      const res = await api.get('/users/details')
      profile.value = res.data.user
    } catch (err) {
      console.error('Could not load profile:', err)
      clearToken()
    }
  }

  return { token, profile, setToken, clearToken, isAuthenticated, fetchProfile }
})
