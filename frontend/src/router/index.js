import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../authStore'
import HomePage from '../pages/HomePage.vue'
import JobsPage from '../pages/JobsPage.vue'
import JobDetailsPage from '../pages/JobDetailsPage.vue'
import AddJobPage from '../pages/AddJobPage.vue'
import EditJobPage from '../pages/EditJobPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/jobs', name: 'Jobs', component: JobsPage },
  { path: '/jobs/add', name: 'AddJob', component: AddJobPage, meta: { requiresEmployer: true } },
  { path: '/jobs/:id', name: 'JobDetails', component: JobDetailsPage },
  { path: '/jobs/:id/edit', name: 'EditJob', component: EditJobPage, meta: { requiresEmployer: true } },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/signup', name: 'Signup', component: SignupPage },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/login')
  } else if (to.meta.requiresEmployer && !(authStore.isEmployer || authStore.isAdmin)) {
    next('/login')
  } else {
    next()
  }
})

export default router

