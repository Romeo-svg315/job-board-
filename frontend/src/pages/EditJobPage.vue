<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <router-link :to="`/jobs/${route.params.id}`" class="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
      <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Job
    </router-link>

    <div v-if="loading" class="card p-8 animate-pulse">
      <div class="h-8 bg-dark-600 rounded w-1/2 mb-8"></div>
      <div class="space-y-4">
        <div class="h-10 bg-dark-600 rounded"></div>
        <div class="h-10 bg-dark-600 rounded"></div>
        <div class="h-24 bg-dark-600 rounded"></div>
      </div>
    </div>

    <div v-else class="card p-8">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-indigo-800/30 border border-indigo-500/20 flex items-center justify-center text-2xl">
          🔧
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-white">Edit Job</h1>
          <p class="text-gray-500 mt-1">Update the details of this listing</p>
        </div>
      </div>

      <transition name="fade">
        <div v-if="success" class="mb-6 flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Job updated successfully! Redirecting...
        </div>
      </transition>

      <transition name="fade">
        <div v-if="apiError" class="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ apiError }}
        </div>
      </transition>

      <form @submit.prevent="updateJob" class="space-y-8" id="edit-job-form">
        <div>
          <h2 class="text-lg font-bold text-white mb-4 pb-2 border-b border-dark-600">Job Details</h2>
          <div class="space-y-5">
            <div>
              <label for="edit-title" class="block text-sm font-medium text-gray-400 mb-2">Job Title *</label>
              <input id="edit-title" v-model="form.title" type="text" class="input-field" required />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="edit-type" class="block text-sm font-medium text-gray-400 mb-2">Job Type *</label>
                <select id="edit-type" v-model="form.type" class="input-field" required>
                  <option v-for="t in jobTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div>
                <label for="edit-location" class="block text-sm font-medium text-gray-400 mb-2">Location *</label>
                <input id="edit-location" v-model="form.location" type="text" class="input-field" required />
              </div>
            </div>
            <div>
              <label for="edit-salary" class="block text-sm font-medium text-gray-400 mb-2">Salary Range</label>
              <input id="edit-salary" v-model="form.salary" type="text" class="input-field" />
            </div>
            <div>
              <label for="edit-description" class="block text-sm font-medium text-gray-400 mb-2">Job Description *</label>
              <textarea id="edit-description" v-model="form.description" rows="6" class="input-field resize-none" required></textarea>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-bold text-white mb-4 pb-2 border-b border-dark-600">Company Information</h2>
          <div class="space-y-5">
            <div>
              <label for="edit-company-name" class="block text-sm font-medium text-gray-400 mb-2">Company Name *</label>
              <input id="edit-company-name" v-model="form.company.name" type="text" class="input-field" required />
            </div>
            <div>
              <label for="edit-company-desc" class="block text-sm font-medium text-gray-400 mb-2">Company Description</label>
              <textarea id="edit-company-desc" v-model="form.company.description" rows="3" class="input-field resize-none"></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="edit-email" class="block text-sm font-medium text-gray-400 mb-2">Contact Email *</label>
                <input id="edit-email" v-model="form.company.contactEmail" type="email" class="input-field" required />
              </div>
              <div>
                <label for="edit-phone" class="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
                <input id="edit-phone" v-model="form.company.contactPhone" type="tel" class="input-field" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 pt-4 border-t border-dark-600">
          <router-link :to="`/jobs/${route.params.id}`" class="btn-secondary">Cancel</router-link>
          <button type="submit" id="save-job" :disabled="submitting" class="btn-primary min-w-[160px] justify-center">
            <svg v-if="!submitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { authStore } from '../authStore'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const submitting = ref(false)
const success = ref(false)
const apiError = ref(null)
const jobTypes = ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship']

const form = ref({
  title: '', type: '', description: '', location: '', salary: '',
  company: { name: '', description: '', contactEmail: '', contactPhone: '' }
})

const updateJob = async () => {
  submitting.value = true
  apiError.value = null
  try {
    await axios.put(`/api/jobs/${route.params.id}`, form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    success.value = true
    setTimeout(() => router.push(`/jobs/${route.params.id}`), 1500)
  } catch (err) {
    apiError.value = err.response?.data?.message || 'Failed to update job. Please try again.'
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await axios.get(`/api/jobs/${route.params.id}`)
    const j = res.data
    form.value = {
      title: j.title, type: j.type, description: j.description,
      location: j.location, salary: j.salary || '',
      company: {
        name: j.company?.name || '', description: j.company?.description || '',
        contactEmail: j.company?.contactEmail || '', contactPhone: j.company?.contactPhone || ''
      }
    }
  } catch (err) {
    apiError.value = 'Could not load job data.'
  } finally {
    loading.value = false
  }
})
</script>
