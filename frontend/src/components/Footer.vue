<template>
  <footer class="mt-20 border-t border-white/10 bg-dark-900/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" />
              </svg>
            </div>
            <span class="text-lg font-bold text-white">Job<span class="text-primary-400">Board</span></span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">
            Your gateway to the best tech opportunities. Find your dream job or hire top talent with ease.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-gray-500 hover:text-primary-400 transition-colors text-sm">Home</router-link></li>
            <li><router-link to="/jobs" class="text-gray-500 hover:text-primary-400 transition-colors text-sm">Browse Jobs</router-link></li>
            <li><router-link to="/jobs/add" class="text-gray-500 hover:text-primary-400 transition-colors text-sm">Post a Job</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white font-semibold mb-4">Contact</h3>
          <p class="text-gray-500 text-sm">hello@jobboard.dev</p>
          <p class="text-gray-500 text-sm mt-1">© {{ new Date().getFullYear() }} JobBoard. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
