<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Back Button -->
    <router-link to="/jobs" class="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
      <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Jobs
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="card p-8 animate-pulse">
      <div class="flex items-start gap-6 mb-8">
        <div class="w-20 h-20 bg-dark-600 rounded-2xl"></div>
        <div class="flex-1">
          <div class="h-8 bg-dark-600 rounded w-3/4 mb-3"></div>
          <div class="h-5 bg-dark-600 rounded w-1/2 mb-3"></div>
          <div class="h-5 bg-dark-600 rounded-full w-24"></div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="h-4 bg-dark-600 rounded w-full"></div>
        <div class="h-4 bg-dark-600 rounded w-full"></div>
        <div class="h-4 bg-dark-600 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20 card p-10">
      <div class="text-5xl mb-4">❌</div>
      <h3 class="text-white text-xl font-bold mb-2">Job not found</h3>
      <p class="text-gray-500 mb-6">{{ error }}</p>
      <router-link to="/jobs" class="btn-primary">Back to Jobs</router-link>
    </div>

    <!-- Job Details -->
    <div v-else-if="job" class="animate-fade-in">
      <!-- Hero Card -->
      <div class="card p-8 mb-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent pointer-events-none"></div>
        <div class="relative flex flex-col sm:flex-row items-start gap-6">
          <!-- Company Icon -->
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600/30 to-primary-800/30 border border-primary-500/20 flex items-center justify-center text-4xl flex-shrink-0">
            💼
          </div>
          <!-- Job Info -->
          <div class="flex-1">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 class="text-3xl font-extrabold text-white mb-1">{{ job.title }}</h1>
                <p class="text-primary-400 text-lg font-semibold">{{ job.company?.name }}</p>
              </div>
              <span :class="getBadgeClass(job.type)" class="text-sm px-4 py-1.5">{{ job.type }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-5 mt-5">
              <div class="flex items-center gap-1.5 text-gray-400 text-sm">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ job.location }}
              </div>
              <div class="flex items-center gap-1.5 text-gray-400 text-sm">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ job.salary }}
              </div>
              <div class="flex items-center gap-1.5 text-gray-400 text-sm">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Posted {{ formatDate(job.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mt-8 pt-6 border-t border-dark-600">
          <button 
            v-if="canApply" 
            @click="handleApply" 
            :disabled="applying || applied"
            class="btn-primary flex-1 sm:flex-none justify-center disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ applied ? 'Applied Successfully' : (applying ? 'Applying...' : 'Apply Now') }}
          </button>
          
          <template v-if="canManage">
            <router-link :to="`/jobs/${job._id}/edit`" class="btn-secondary flex-1 sm:flex-none justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Job
            </router-link>
            <button @click="confirmDelete" class="btn-danger flex-1 sm:flex-none justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Description -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card p-6">
            <h2 class="text-xl font-bold text-white mb-4">Job Description</h2>
            <p class="text-gray-400 leading-relaxed whitespace-pre-wrap">{{ job.description }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Company Info -->
          <div class="card p-6">
            <h2 class="text-xl font-bold text-white mb-4">Company Info</h2>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600 text-xs uppercase tracking-wider mb-1">Company</p>
                <p class="text-white font-semibold">{{ job.company?.name }}</p>
              </div>
              <div v-if="job.company?.description">
                <p class="text-gray-600 text-xs uppercase tracking-wider mb-1">About</p>
                <p class="text-gray-400 text-sm">{{ job.company.description }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-xs uppercase tracking-wider mb-1">Contact Email</p>
                <a :href="`mailto:${job.company?.contactEmail}`" class="text-primary-400 hover:text-primary-300 transition-colors text-sm">
                  {{ job.company?.contactEmail }}
                </a>
              </div>
              <div v-if="job.company?.contactPhone">
                <p class="text-gray-600 text-xs uppercase tracking-wider mb-1">Phone</p>
                <a :href="`tel:${job.company.contactPhone}`" class="text-primary-400 hover:text-primary-300 transition-colors text-sm">
                  {{ job.company.contactPhone }}
                </a>
              </div>
            </div>
          </div>

          <!-- Quick Facts -->
          <div class="card p-6">
            <h2 class="text-xl font-bold text-white mb-4">Job Overview</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-500 text-sm">Type</span>
                <span :class="getBadgeClass(job.type)" class="text-xs">{{ job.type }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500 text-sm">Location</span>
                <span class="text-white text-sm font-medium">{{ job.location }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500 text-sm">Salary</span>
                <span class="text-white text-sm font-medium">{{ job.salary }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative card p-8 max-w-sm w-full animate-slide-up">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-white text-xl font-bold mb-2">Delete Job?</h3>
          <p class="text-gray-500 mb-6">Are you sure you want to delete "{{ job?.title }}"? This action cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false" class="btn-secondary flex-1 justify-center">Cancel</button>
            <button @click="deleteJob" :disabled="deleting" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { authStore } from '../authStore'

const route = useRoute()
const router = useRouter()
const job = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)
const applying = ref(false)
const applied = ref(false)

const canManage = computed(() => {
  if (!authStore.isAuthenticated || !job.value) return false
  return authStore.isAdmin || (authStore.isEmployer && job.value.postedBy === authStore.user._id)
})

const canApply = computed(() => {
  return authStore.isEmployee || !authStore.isAuthenticated
})

const getBadgeClass = (type) => {
  const map = {
    'Full-Time': 'badge-full-time',
    'Part-Time': 'badge-part-time',
    'Remote': 'badge-remote',
    'Contract': 'badge-contract',
    'Internship': 'badge-internship',
  }
  return map[type] || 'badge bg-gray-500/20 text-gray-400'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const confirmDelete = () => { showDeleteModal.value = true }

const deleteJob = async () => {
  deleting.value = true
  try {
    await axios.delete(`/api/jobs/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    router.push('/jobs')
  } catch (err) {
    console.error(err)
    deleting.value = false
    showDeleteModal.value = false
  }
}

const handleApply = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  applying.value = true
  try {
    await axios.post(`/api/jobs/${route.params.id}/apply`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    applied.value = true
  } catch (err) {
    console.error(err)
  } finally {
    applying.value = false
  }
}

onMounted(async () => {
  try {
    const res = await axios.get(`/api/jobs/${route.params.id}`)
    job.value = res.data
  } catch (err) {
    error.value = 'This job listing could not be found.'
  } finally {
    loading.value = false
  }
})
</script>
