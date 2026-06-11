<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-extrabold text-white mb-2">Admin Dashboard</h1>
      <p class="text-gray-400">Manage user accounts and job postings</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Users Management -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Accounts
          </h2>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-gray-500 text-xs uppercase tracking-wider border-b border-dark-600">
                  <th class="pb-3 px-2">Email</th>
                  <th class="pb-3 px-2">Role</th>
                  <th class="pb-3 px-2">Status</th>
                  <th class="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-600">
                <tr v-for="user in users" :key="user._id" class="text-gray-300">
                  <td class="py-4 px-2 font-medium">{{ user.email }}</td>
                  <td class="py-4 px-2">
                    <span :class="roleClass(user.role)">{{ user.role }}</span>
                  </td>
                  <td class="py-4 px-2">
                    <span :class="statusClass(user.status)">{{ user.status }}</span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        v-if="user.role === 'employer' && user.status === 'pending'"
                        @click="activateUser(user._id)"
                        class="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Activate"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        @click="deleteUser(user._id)"
                        class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Stats / Actions -->
      <div class="space-y-6">
        <div class="card p-6">
          <h2 class="text-xl font-bold text-white mb-4">Quick Stats</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-dark-700 rounded-xl">
              <span class="text-gray-400">Total Users</span>
              <span class="text-white font-bold">{{ users.length }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-dark-700 rounded-xl">
              <span class="text-gray-400">Pending Employers</span>
              <span class="text-yellow-400 font-bold">{{ pendingEmployersCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { authStore } from '../authStore'

const users = ref([])
const jobs = ref([])

const pendingEmployersCount = computed(() => {
  return users.value.filter(u => u.role === 'employer' && u.status === 'pending').length
})

const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const activateUser = async (id) => {
  try {
    await axios.put(`/api/admin/users/${id}/activate`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    fetchUsers()
  } catch (err) {
    console.error(err)
  }
}

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to remove this user?')) return
  try {
    await axios.delete(`/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    fetchUsers()
  } catch (err) {
    console.error(err)
  }
}

const roleClass = (role) => {
  const map = {
    admin: 'px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium',
    employer: 'px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium',
    employee: 'px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium',
  }
  return map[role]
}

const statusClass = (status) => {
  return status === 'active' 
    ? 'text-green-400 text-xs' 
    : 'text-yellow-400 text-xs'
}

onMounted(fetchUsers)
</script>
