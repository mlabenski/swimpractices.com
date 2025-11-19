<template>
  <div class="support-page min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
    <!-- Header -->
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <button
        @click="$router.push('/')"
        class="mb-6 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>

      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4">Support</h1>
        <p class="text-xl text-gray-300">We're here to help! Get in touch with our team.</p>
      </div>

      <!-- Support Boxes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Email Support Box -->
        <a
          href="mailto:support@swimpractices.com"
          class="support-card group"
        >
          <div class="flex flex-col items-center text-center">
            <!-- Email Icon -->
            <div class="icon-wrapper mb-6">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>

            <h2 class="text-2xl font-bold mb-3">Email Support</h2>
            <p class="text-gray-300 mb-4">
              Send us an email and we'll get back to you within 24-48 hours.
            </p>

            <div class="email-box">
              <p class="text-lg font-semibold text-blue-300">support@swimpractices.com</p>
            </div>

            <div class="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span class="font-semibold">Send Email</span>
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          </div>
        </a>

        <!-- Discord Support Box -->
        <a
          href="https://discord.com/invite/Pqapcrcx"
          target="_blank"
          rel="noopener noreferrer"
          class="support-card group"
        >
          <div class="flex flex-col items-center text-center">
            <!-- Discord Icon -->
            <div class="icon-wrapper mb-6">
              <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>

            <h2 class="text-2xl font-bold mb-3">Discord Community</h2>
            <p class="text-gray-300 mb-4">
              Join our community for instant support, discussions, and updates.
            </p>

            <div class="discord-box">
              <p class="text-lg font-semibold text-indigo-300">discord.com/invite/Pqapcrcx</p>
            </div>

            <div class="mt-6 flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
              <span class="font-semibold">Join Discord</span>
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
          </div>
        </a>
      </div>

      <!-- Additional Information -->
      <div class="support-card mt-8">
        <h2 class="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-blue-300">What's the best way to get support?</h3>
            <p class="text-gray-300">
              For quick questions and community help, join our Discord server. For account-specific issues or detailed inquiries, email us at support@swimpractices.com.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-blue-300">How quickly will I get a response?</h3>
            <p class="text-gray-300">
              Email responses typically take 24-48 hours. Discord community members and moderators often respond within minutes during active hours.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-blue-300">What information should I include in my support request?</h3>
            <p class="text-gray-300">
              Please include your account email, a detailed description of the issue, and any relevant screenshots. This helps us resolve your issue faster.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-blue-300">Do you offer phone support?</h3>
            <p class="text-gray-300">
              Currently, we offer support through email and Discord only. These channels allow us to provide detailed responses and maintain a record of our conversations.
            </p>
          </div>
        </div>
      </div>

      <!-- Support Hours -->
      <div class="support-card mt-6 bg-blue-900 bg-opacity-30 border-blue-500">
        <div class="text-center">
          <h2 class="text-xl font-bold mb-3">Support Hours</h2>
          <p class="text-gray-300">
            Our team is available Monday through Friday, 9:00 AM - 6:00 PM EST
          </p>
          <p class="text-gray-400 text-sm mt-2">
            (Discord community is active 24/7)
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter/AppFooter.vue';

export default {
  name: 'SupportPage',
  components: {
    AppFooter,
  },
  head() {
    return {
      title: 'Support - SwimPractices',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Get support for SwimPractices. Contact us via email or join our Discord community for help and updates.',
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Glassmorphism card styling */
.support-card {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 2.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
}

.support-card:hover {
  background: rgba(31, 41, 55, 0.7);
  border-color: rgba(107, 114, 128, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
}

.support-card:active {
  transform: translateY(-2px);
}

/* Icon styling */
.icon-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.support-card:hover .icon-wrapper {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  transform: scale(1.05);
}

.icon-wrapper svg {
  color: rgba(96, 165, 250, 0.9);
}

/* Email and Discord boxes */
.email-box,
.discord-box {
  background: rgba(55, 65, 81, 0.5);
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(75, 85, 99, 0.3);
  word-break: break-all;
}

.support-card:hover .email-box,
.support-card:hover .discord-box {
  background: rgba(55, 65, 81, 0.7);
  border-color: rgba(75, 85, 99, 0.5);
}

/* Typography */
h2 {
  color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .support-card {
    padding: 1.5rem;
  }

  .icon-wrapper {
    width: 80px;
    height: 80px;
  }

  .icon-wrapper svg {
    width: 48px;
    height: 48px;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .email-box p,
  .discord-box p {
    font-size: 0.875rem;
  }
}

/* Remove default link underline */
a.support-card {
  text-decoration: none;
}
</style>
