<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../authStore'

const router = useRouter()
const mobileOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="sticky top-0 z-50 glass border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" />
            </svg>
          </div>
          <span class="text-xl font-bold text-white tracking-tight">Job<span class="text-primary-400">Board</span></span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="nav-link group" active-class="text-white">Home</router-link>
          <router-link to="/jobs" class="nav-link group" active-class="text-white">Browse Jobs</router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link group" active-class="text-white">Admin</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <span class="text-gray-600">|</span>
            <span class="text-gray-400 text-sm">{{ authStore.user.email }}</span>
            <button @click="handleLogout" class="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-gray-400 hover:text-white font-medium text-sm">Login</router-link>
            <router-link to="/signup" class="btn-secondary text-sm px-4 py-2">Sign Up</router-link>
          </template>
        </div>

        <!-- Post a Job Button (Employers & Admins) -->
        <div class="flex items-center gap-4">
          <router-link 
            v-if="authStore.isAdmin || authStore.isEmployer"
            to="/jobs/add" 
            class="btn-primary text-sm px-5 py-2.5 hidden sm:flex"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </router-link>

          <!-- Mobile menu button -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors">
            <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="slide-down">
      <div v-if="mobileOpen" class="md:hidden border-t border-white/10 bg-dark-800/95 backdrop-blur-md px-4 py-6 space-y-4">
        <router-link to="/" class="block text-gray-400 font-medium" @click="mobileOpen = false">Home</router-link>
        <router-link to="/jobs" class="block text-gray-400 font-medium" @click="mobileOpen = false">Browse Jobs</router-link>
        <router-link v-if="authStore.isAdmin" to="/admin" class="block text-gray-400 font-medium" @click="mobileOpen = false">Admin</router-link>
        
        <div class="pt-4 border-t border-white/5 space-y-4">
          <template v-if="authStore.isAuthenticated">
            <p class="text-gray-500 text-xs">{{ authStore.user.email }}</p>
            <button @click="handleLogout(); mobileOpen = false" class="text-red-400 font-medium">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="block text-gray-400 font-medium" @click="mobileOpen = false">Login</router-link>
            <router-link to="/signup" class="block text-primary-400 font-medium" @click="mobileOpen = false">Sign Up</router-link>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-400 hover:text-white font-medium transition-colors duration-200 relative;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>