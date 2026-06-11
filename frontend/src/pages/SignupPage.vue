<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="card max-w-md w-full p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-gray-400">Join our community today and start using the app instantly — no admin approval needed.</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">I am an</label>
          <div class="text-xs text-gray-400 mb-3">Choose your role and sign up instantly — you can log in right away.</div>
          <div class="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              @click="role = 'employee'"
              :class="['px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300', 
                       role === 'employee' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400']"
            >
              Employee
            </button>
            <button 
              type="button" 
              @click="role = 'employer'"
              :class="['px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300', 
                       role === 'employer' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400']"
            >
              Employer
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="input-field" 
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="input-field" 
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {{ error }}
        </div>

        <button :disabled="loading" type="submit" class="btn-primary w-full justify-center">
          <span v-if="loading">Creating account...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-500">
        Already have an account? 
        <router-link to="/login" class="text-primary-400 hover:text-primary-300 font-medium">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { authStore } from '../authStore'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('employee')
const error = ref('')
const loading = ref(false)

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.post('/api/auth/signup', {
      email: email.value,
      password: password.value,
      role: role.value
    })

    authStore.setUser(res.data, res.data.token)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Signup failed'
  } finally {
    loading.value = false
  }
}
</script>
