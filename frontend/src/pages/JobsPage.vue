<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold text-white mb-2">Browse Jobs</h1>
      <p class="text-gray-500">Find the perfect opportunity for you</p>
    </div>

    <!-- Filters -->
    <div class="card p-5 mb-8 flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          id="search-jobs"
          placeholder="Search jobs, companies..."
          class="input-field pl-10"
        />
      </div>
      <select v-model="selectedType" id="filter-type" class="input-field sm:w-48">
        <option value="">All Types</option>
        <option v-for="type in jobTypes" :key="type" :value="type">{{ type }}</option>
      </select>
      <select v-model="selectedSort" id="filter-sort" class="input-field sm:w-48">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>

    <!-- Results Count -->
    <div class="mb-6 flex items-center justify-between">
      <p class="text-gray-500 text-sm">
        Showing <span class="text-white font-semibold">{{ filteredJobs.length }}</span> jobs
      </p>
      <router-link to="/jobs/add" class="btn-primary text-sm px-4 py-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Post a Job
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6 animate-pulse">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-dark-600 rounded-xl"></div>
          <div class="h-5 bg-dark-600 rounded-full w-24"></div>
        </div>
        <div class="h-5 bg-dark-600 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-dark-600 rounded w-1/2 mb-6"></div>
        <div class="h-3 bg-dark-600 rounded w-full mb-2"></div>
        <div class="h-3 bg-dark-600 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20 card p-10">
      <div class="text-5xl mb-4">⚠️</div>
      <h3 class="text-white text-xl font-bold mb-2">Could not load jobs</h3>
      <p class="text-gray-500 mb-6">{{ error }}</p>
      <button @click="fetchJobs" class="btn-primary">Try Again</button>
    </div>

    <!-- Jobs Grid -->
    <div v-else-if="filteredJobs.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <router-link
        v-for="job in filteredJobs"
        :key="job._id"
        :to="`/jobs/${job._id}`"
        class="card p-6 block group animate-fade-in"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/30 to-primary-800/30 border border-primary-500/20 flex items-center justify-center text-xl">
            💼
          </div>
          <span :class="getBadgeClass(job.type)">{{ job.type }}</span>
        </div>

        <h2 class="text-white font-bold text-lg mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">{{ job.title }}</h2>
        <p class="text-primary-400 text-sm font-medium mb-3">{{ job.company?.name }}</p>

        <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ job.description }}</p>

        <div class="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ job.location }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ job.salary }}
          </span>
        </div>

        <div class="pt-4 border-t border-dark-600 flex items-center justify-between">
          <span class="text-gray-600 text-xs">{{ formatDate(job.createdAt) }}</span>
          <span class="text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View Details →
          </span>
        </div>
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 card p-10">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-white text-xl font-bold mb-2">No jobs found</h3>
      <p class="text-gray-500 mb-6">Try adjusting your search or filters, or post a new job.</p>
      <router-link to="/jobs/add" class="btn-primary">Post a Job</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const jobs = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref('')
const selectedType = ref('')
const selectedSort = ref('newest')

const jobTypes = ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship']

const filteredJobs = computed(() => {
  let result = [...jobs.value]

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company?.name?.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    )
  }

  if (selectedType.value) {
    result = result.filter(j => j.type === selectedType.value)
  }

  result.sort((a, b) => {
    const da = new Date(a.createdAt)
    const db = new Date(b.createdAt)
    return selectedSort.value === 'newest' ? db - da : da - db
  })

  return result
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
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const fetchJobs = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('/api/jobs')
    jobs.value = res.data
  } catch (err) {
    error.value = 'Could not connect to the server. Make sure the backend is running.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchJobs)
</script>
