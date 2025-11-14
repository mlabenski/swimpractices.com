<template>
  <footer class="app-footer bg-gray-900 text-white border-t border-gray-800">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Discord Link -->
        <div class="flex items-center space-x-2">
          <svg class="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <a
            href="https://discord.gg/Pqapcrcx"
            target="_blank"
            rel="noopener noreferrer"
            class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium"
          >
            Join our Discord
          </a>
        </div>

        <!-- Footer Links -->
        <div class="flex items-center space-x-6 text-sm">
          <a
            href="https://discord.gg/Pqapcrcx"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Terms of Service
          </a>
          <span class="text-gray-700">|</span>
          <a
            href="https://discord.gg/Pqapcrcx"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Remove my data
          </a>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-6 text-center text-sm text-gray-500">
        © {{ currentYear }} SwimPractices. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.app-footer {
  margin-top: auto;
  width: 100%;
  background: linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 1));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .app-footer {
    padding: 1.5rem 1rem;
  }
}
</style>
