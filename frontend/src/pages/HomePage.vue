<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-32">
      <!-- Background glow effects -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-600/10 rounded-full blur-3xl"></div>
        <div class="absolute top-40 left-1/4 w-64 h-64 bg-primary-800/10 rounded-full blur-2xl"></div>
        <div class="absolute top-20 right-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-primary-400 animate-pulse-slow"></span>
          #1 Job Board for Tech Professionals
        </div>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
          Find Your Dream<br />
          <span class="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">Tech Job</span>
        </h1>

        <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
          Discover thousands of opportunities at top tech companies. Get hired faster with our curated job listings tailored to your skills.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <router-link to="/jobs" class="btn-primary text-base px-8 py-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All Jobs
          </router-link>
          <router-link to="/jobs/add" class="btn-secondary text-base px-8 py-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </router-link>
        </div>

        <!-- Stats -->
        <div class="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="card p-5 text-center">
            <p class="text-3xl font-extrabold text-white">{{ stat.value }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Job Types Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title mb-3">Browse by Category</h2>
          <p class="text-gray-500">Explore roles across all work arrangements</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <router-link
            v-for="cat in categories"
            :key="cat.label"
            :to="`/jobs?type=${cat.label}`"
            class="card p-5 text-center group cursor-pointer"
          >
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110', cat.bg]">
              <span class="text-2xl">{{ cat.icon }}</span>
            </div>
            <p class="text-white font-semibold text-sm">{{ cat.label }}</p>
            <p class="text-gray-600 text-xs mt-1">{{ cat.desc }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Recent Jobs Preview -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="section-title mb-2">Latest Opportunities</h2>
            <p class="text-gray-500">Fresh listings added every day</p>
          </div>
          <router-link to="/jobs" class="btn-secondary text-sm">
            View All
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="card p-6 animate-pulse">
            <div class="h-4 bg-dark-600 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-dark-600 rounded w-1/2 mb-6"></div>
            <div class="h-3 bg-dark-600 rounded w-full mb-2"></div>
            <div class="h-3 bg-dark-600 rounded w-2/3"></div>
          </div>
        </div>

        <!-- Job Cards -->
        <div v-else-if="jobs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="job in jobs"
            :key="job._id"
            :to="`/jobs/${job._id}`"
            class="card p-6 block group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/30 to-primary-800/30 border border-primary-500/20 flex items-center justify-center text-xl">
                💼
              </div>
              <span :class="getBadgeClass(job.type)">{{ job.type }}</span>
            </div>
            <h3 class="text-white font-bold text-lg mb-1 group-hover:text-primary-400 transition-colors">{{ job.title }}</h3>
            <p class="text-primary-400 text-sm font-medium mb-3">{{ job.company?.name }}</p>
            <div class="flex items-center gap-1 text-gray-500 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ job.location }}
            </div>
            <div class="mt-4 pt-4 border-t border-dark-600 flex items-center justify-between">
              <span class="text-gray-500 text-xs">{{ job.salary }}</span>
              <span class="text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                View Details →
              </span>
            </div>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <p class="text-gray-500 text-lg mb-4">No jobs posted yet.</p>
          <router-link to="/jobs/add" class="btn-primary">Post the First Job</router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="card p-12 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-indigo-600/10 pointer-events-none"></div>
          <div class="relative">
            <h2 class="text-4xl font-extrabold text-white mb-4">Ready to hire top talent?</h2>
            <p class="text-gray-400 text-lg mb-8">Post your job for free and reach thousands of qualified professionals.</p>
            <router-link to="/jobs/add" class="btn-primary text-base px-10 py-4">
              Post a Job — It's Free
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jobs = ref([])
const loading = ref(true)

const stats = [
  { value: '10K+', label: 'Active Jobs' },
  { value: '5K+', label: 'Companies' },
  { value: '50K+', label: 'Job Seekers' },
  { value: '98%', label: 'Success Rate' },
]

const categories = [
  { label: 'Full-Time', icon: '🏢', bg: 'bg-green-500/10', desc: 'Permanent roles' },
  { label: 'Part-Time', icon: '⏰', bg: 'bg-yellow-500/10', desc: 'Flexible hours' },
  { label: 'Remote', icon: '🌍', bg: 'bg-blue-500/10', desc: 'Work from anywhere' },
  { label: 'Contract', icon: '📄', bg: 'bg-purple-500/10', desc: 'Project based' },
  { label: 'Internship', icon: '🎓', bg: 'bg-pink-500/10', desc: 'Start your career' },
]

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

onMounted(async () => {
  try {
    const res = await axios.get('/api/jobs')
    jobs.value = res.data.slice(0, 6)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
