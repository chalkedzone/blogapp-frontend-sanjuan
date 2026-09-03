<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
    <div class="card p-4 auth-card" style="width: 100%; max-width: 400px;">

      <div class="text-center mb-3">
        <div class="brand-mark">Scriptify</div>
      </div>

      <h4 class="mb-3 text-center">{{ isRegister ? 'Create your account' : 'Log back in' }}</h4>

      <form @submit.prevent="submit">
        <input
          v-if="isRegister"
          type="text"
          v-model="form.username"
          class="form-control mb-2"
          placeholder="Username"
        />
        <input type="email" v-model="form.email" class="form-control mb-2" placeholder="Email" />
        <input type="password" v-model="form.password" class="form-control mb-3" placeholder="Password" />
        <button class="btn btn-accent w-100" :disabled="isLoading">
          {{ isLoading ? 'Please wait...' : (isRegister ? 'Register' : 'Log In') }}
        </button>
      </form>

      <div class="mt-3 text-center">
        <button class="btn btn-link toggle-link" @click="isRegister = !isRegister">
          {{ isRegister ? 'Already have an account?' : 'Need an account?' }}
        </button>
      </div>

      <p class="text-danger text-center mb-0" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const user = useUserStore()

const isRegister = ref(false)
const form = ref({ username: '', email: '', password: '' })
const error = ref('')
const isLoading = ref(false)

const submit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    if (isRegister.value) {
      await api.post('/users/register', {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      })
    }

    const res = await api.post('/users/login', {
      email: form.value.email,
      password: form.value.password
    })

    user.setToken(res.data.access)
    await user.fetchProfile()

    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (user.token) {
    router.push('/')
  }
})
</script>
