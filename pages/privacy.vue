<template>
  <div class="privacy-page min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
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
        <h1 class="text-5xl font-bold mb-4">Privacy Policy</h1>
        <p class="text-xl text-gray-300">Last Updated: November 19, 2025</p>
      </div>

      <!-- Introduction -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Introduction</h2>
        <p class="section-text">
          Welcome to SwimPractices. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our mobile application and web platform (collectively, "Services").
        </p>
        <p class="section-text mt-4">
          By using SwimPractices, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Services.
        </p>
      </div>

      <!-- Information We Collect -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Information We Collect</h2>

        <h3 class="subsection-title">1. Apple Sign-In Data (iOS App)</h3>
        <p class="section-text">
          When you sign in using Apple Sign-In on our iOS app, we collect:
        </p>
        <ul class="privacy-list">
          <li><strong>Email Address:</strong> Your email address or Apple's private relay email if you choose to hide your email</li>
          <li><strong>Full Name:</strong> Your first and last name as provided by your Apple ID</li>
          <li><strong>Apple User ID:</strong> A unique identifier provided by Apple to identify your account</li>
        </ul>
        <p class="section-text mt-4">
          We use this information solely for account creation, authentication, and to provide you with a personalized experience.
        </p>

        <h3 class="subsection-title mt-6">2. Account Registration Data (Web App)</h3>
        <p class="section-text">
          When you create an account on our web platform, we collect:
        </p>
        <ul class="privacy-list">
          <li><strong>Email Address:</strong> Used for account identification and password recovery</li>
          <li><strong>Username:</strong> Your display name within the app</li>
          <li><strong>User ID:</strong> A unique identifier assigned to your account</li>
        </ul>

        <h3 class="subsection-title mt-6">3. HealthKit Data (iOS App)</h3>
        <p class="section-text">
          With your explicit permission, our iOS app accesses HealthKit to retrieve swimming workout data, including:
        </p>
        <ul class="privacy-list">
          <li><strong>Swimming Workouts:</strong> Distance, duration, and stroke type</li>
          <li><strong>Workout Metrics:</strong> Swimming performance data and fitness information</li>
          <li><strong>Activity Data:</strong> General workout and activity information related to swimming</li>
        </ul>
        <p class="section-text mt-4">
          <strong>Important:</strong> HealthKit data is only accessed when you grant permission through iOS system prompts. This data is used exclusively to enhance your training experience and is never shared with third parties. You can revoke HealthKit permissions at any time through your device's Settings app.
        </p>

        <h3 class="subsection-title mt-6">4. Swimming Practice & Preference Data</h3>
        <p class="section-text">
          To provide personalized swim practice recommendations, we collect and store:
        </p>
        <ul class="privacy-list">
          <li><strong>Swimming Intervals:</strong> Your pace preferences for different strokes (freestyle, backstroke, butterfly, breaststroke, individual medley)</li>
          <li><strong>Pool Preferences:</strong> Your preferred pool length (25 yards, 25 meters, 50 meters)</li>
          <li><strong>Practice History:</strong> Swim practices you've created, completed, or saved</li>
          <li><strong>Skill Level:</strong> Experience level to tailor workout difficulty</li>
          <li><strong>Season Tracker Data:</strong> Optional training goals and progress metrics</li>
          <li><strong>Pinned Practices:</strong> Practices you've bookmarked for quick access</li>
        </ul>

        <h3 class="subsection-title mt-6">5. Usage Data & Analytics</h3>
        <p class="section-text">
          We automatically collect certain information when you use our Services:
        </p>
        <ul class="privacy-list">
          <li><strong>Device Information:</strong> Browser type, operating system, device model</li>
          <li><strong>Usage Information:</strong> Pages viewed, features used, time spent in the app</li>
          <li><strong>Performance Data:</strong> App crashes, errors, and performance metrics</li>
          <li><strong>Location Data:</strong> Approximate geographic location based on IP address (web app only)</li>
        </ul>
        <p class="section-text mt-4">
          This data is collected through Google Analytics (Firebase) and is used to improve app performance and user experience.
        </p>
      </div>

      <!-- How We Use Your Information -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">How We Use Your Information</h2>
        <p class="section-text">We use the collected information for the following purposes:</p>
        <ul class="privacy-list">
          <li><strong>Account Management:</strong> Create and manage your user account, authenticate your identity</li>
          <li><strong>Personalized Experience:</strong> Generate customized swim practices based on your preferences, skill level, and goals</li>
          <li><strong>AI Practice Generation:</strong> Use your historical data and preferences to create intelligent, progressive workout plans</li>
          <li><strong>Progress Tracking:</strong> Track your training progress, total distance, and season goals</li>
          <li><strong>Leaderboard Features:</strong> Display your total swimming distance on community leaderboards (updated every 24 hours)</li>
          <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance features and user experience</li>
          <li><strong>Communication:</strong> Send you important updates about your account or our Services</li>
          <li><strong>Technical Support:</strong> Respond to your requests and provide customer support</li>
        </ul>
      </div>

      <!-- Data Storage & Third-Party Services -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Data Storage & Third-Party Services</h2>

        <h3 class="subsection-title">Firebase / Google Cloud Platform</h3>
        <p class="section-text">
          We use Firebase (a Google service) to store and manage your data. Your information is stored in Firebase's Cloud Firestore database, which is subject to Google's security standards and privacy practices.
        </p>
        <ul class="privacy-list mt-4">
          <li><strong>What we store:</strong> User profiles, practice data, preferences, authentication tokens, and analytics</li>
          <li><strong>Location:</strong> Data is stored on Google Cloud servers, which may be located in various geographic regions</li>
          <li><strong>Privacy Policy:</strong> <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" class="privacy-link">https://firebase.google.com/support/privacy</a></li>
        </ul>

        <h3 class="subsection-title mt-6">Netlify Identity</h3>
        <p class="section-text">
          Our web application uses Netlify Identity for user authentication and account management.
        </p>
        <ul class="privacy-list mt-4">
          <li><strong>What they receive:</strong> Email address, username, authentication metadata</li>
          <li><strong>Privacy Policy:</strong> <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" class="privacy-link">https://www.netlify.com/privacy/</a></li>
        </ul>

        <h3 class="subsection-title mt-6">AI Practice Generation Service</h3>
        <p class="section-text">
          To generate intelligent swim practices, we use an AI-powered service that receives:
        </p>
        <ul class="privacy-list mt-4">
          <li>Your swimming preferences and interval settings</li>
          <li>Historical practice data and patterns</li>
          <li>Season progression information</li>
          <li>Distance and stroke preferences</li>
        </ul>
        <p class="section-text mt-4">
          This data is used solely to generate personalized workout plans and is not used for any other purpose.
        </p>

        <h3 class="subsection-title mt-6">Google Analytics</h3>
        <p class="section-text">
          We use Google Analytics to understand how users interact with our Services. Google Analytics collects standard web analytics data including page views, session duration, device information, and approximate geographic location.
        </p>
        <ul class="privacy-list mt-4">
          <li><strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="privacy-link">https://policies.google.com/privacy</a></li>
          <li><strong>Opt-out:</strong> You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="privacy-link">Google Analytics Opt-out Browser Add-on</a></li>
        </ul>

        <h3 class="subsection-title mt-6">Local Storage (Web App)</h3>
        <p class="section-text">
          Our web application stores certain data in your browser's local storage to improve performance and reduce server requests:
        </p>
        <ul class="privacy-list mt-4">
          <li>Cached practice data (refreshed every 50 minutes)</li>
          <li>Last fetch timestamps</li>
        </ul>
        <p class="section-text mt-4">
          This data remains on your device and can be cleared by clearing your browser's cache.
        </p>
      </div>

      <!-- Data Sharing -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Data Sharing & Disclosure</h2>
        <p class="section-text">
          We do not sell, trade, or rent your personal information to third parties. We only share your data in the following limited circumstances:
        </p>
        <ul class="privacy-list">
          <li><strong>Service Providers:</strong> With trusted third-party services (Firebase, Netlify, Google Analytics) necessary to operate our Services</li>
          <li><strong>Public Information:</strong> Your username and total swimming distance may be displayed on public leaderboards</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation</li>
          <li><strong>Safety & Protection:</strong> To protect the rights, property, or safety of SwimPractices, our users, or others</li>
        </ul>
      </div>

      <!-- Data Security -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Data Security</h2>
        <p class="section-text">
          We implement industry-standard security measures to protect your personal information:
        </p>
        <ul class="privacy-list">
          <li><strong>Encryption:</strong> Data transmission is encrypted using HTTPS/TLS protocols</li>
          <li><strong>Authentication:</strong> Secure authentication tokens with automatic expiration (1-hour lifetime)</li>
          <li><strong>Access Controls:</strong> Cloud Functions validate user permissions to ensure you can only access your own data</li>
          <li><strong>Data Separation:</strong> Public and private user data are stored in separate database collections</li>
          <li><strong>Token Management:</strong> Authentication tokens are not stored in browser storage for enhanced security</li>
        </ul>
        <p class="section-text mt-4">
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
        </p>
      </div>

      <!-- Your Privacy Rights -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Your Privacy Rights</h2>
        <p class="section-text">You have the following rights regarding your personal data:</p>
        <ul class="privacy-list">
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Correction:</strong> Update or correct your account information at any time</li>
          <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
          <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
          <li><strong>HealthKit Control:</strong> Revoke HealthKit permissions through iOS Settings at any time</li>
          <li><strong>Opt-out:</strong> Opt out of analytics tracking through browser settings or Google Analytics opt-out</li>
        </ul>
        <p class="section-text mt-4">
          To exercise any of these rights, please contact us using the information provided below.
        </p>
      </div>

      <!-- Data Retention -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Data Retention</h2>
        <p class="section-text">We retain your personal information for the following periods:</p>
        <ul class="privacy-list">
          <li><strong>Account Data:</strong> Retained for the lifetime of your account unless you request deletion</li>
          <li><strong>Practice History:</strong> Retained indefinitely to maintain your training records</li>
          <li><strong>Daily Generated Practices:</strong> Cleared and regenerated every 24 hours</li>
          <li><strong>Cached Browser Data:</strong> Automatically cleared after 50 minutes</li>
          <li><strong>Analytics Data:</strong> Retained according to Google Analytics retention policies (14-50 months)</li>
        </ul>
        <p class="section-text mt-4">
          Upon account deletion, we will remove your personal information from our active databases within 30 days, though some data may remain in backups for a limited time.
        </p>
      </div>

      <!-- Children's Privacy -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Children's Privacy</h2>
        <p class="section-text">
          SwimPractices is designed for swimmers of all ages, including minors. We comply with the Children's Online Privacy Protection Act (COPPA) and do not knowingly collect personal information from children under 13 without parental consent.
        </p>
        <p class="section-text mt-4">
          If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us immediately, and we will delete such information from our systems.
        </p>
      </div>

      <!-- International Data Transfers -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">International Data Transfers</h2>
        <p class="section-text">
          Your information may be transferred to, and maintained on, servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.
        </p>
        <p class="section-text mt-4">
          By using SwimPractices, you consent to the transfer of your information to the United States and other countries where our service providers operate.
        </p>
      </div>

      <!-- California Privacy Rights -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">California Privacy Rights (CCPA)</h2>
        <p class="section-text">
          If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
        </p>
        <ul class="privacy-list">
          <li>Right to know what personal information is collected, used, shared, or sold</li>
          <li>Right to delete personal information held by businesses</li>
          <li>Right to opt-out of sale of personal information (Note: We do not sell personal information)</li>
          <li>Right to non-discrimination for exercising CCPA rights</li>
        </ul>
        <p class="section-text mt-4">
          To exercise these rights, please contact us using the information below.
        </p>
      </div>

      <!-- Changes to Privacy Policy -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Changes to This Privacy Policy</h2>
        <p class="section-text">
          We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this policy.
        </p>
        <p class="section-text mt-4">
          We encourage you to review this Privacy Policy periodically. Continued use of our Services after changes are posted constitutes your acceptance of the updated policy.
        </p>
      </div>

      <!-- Contact Information -->
      <div class="privacy-card mb-6">
        <h2 class="section-title">Contact Us</h2>
        <p class="section-text">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
        <div class="contact-box mt-4">
          <p class="font-semibold">SwimPractices</p>
          <p class="text-gray-300 mt-2">Email: <a href="mailto:privacy@swimpractices.com" class="privacy-link">privacy@swimpractices.com</a></p>
          <p class="text-gray-300 mt-1">For privacy-related inquiries, we will respond within 30 days.</p>
        </div>
      </div>

      <!-- Summary -->
      <div class="privacy-card bg-blue-900 bg-opacity-30 border-blue-500">
        <h2 class="section-title">Summary</h2>
        <p class="section-text">
          At SwimPractices, your privacy matters. We collect only the information necessary to provide you with an exceptional swimming training experience. Your data is secured, never sold, and you maintain control over your information at all times.
        </p>
        <p class="section-text mt-4">
          Thank you for trusting SwimPractices with your swimming journey.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter/AppFooter.vue';

export default {
  name: 'PrivacyPage',
  components: {
    AppFooter,
  },
  head() {
    return {
      title: 'Privacy Policy - SwimPractices',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Privacy Policy for SwimPractices - Learn how we collect, use, and protect your personal information including Apple Sign-In, HealthKit data, and Firebase storage.',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'privacy policy, data protection, HealthKit privacy, Apple Sign-In, Firebase security, swimming app privacy',
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Glassmorphism card styling */
.privacy-card {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.privacy-card:hover {
  background: rgba(31, 41, 55, 0.6);
  border-color: rgba(107, 114, 128, 0.3);
}

/* Typography */
.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f3f4f6;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #93c5fd;
}

.section-text {
  font-size: 1rem;
  line-height: 1.75;
  color: #d1d5db;
}

/* Lists */
.privacy-list {
  list-style: disc;
  margin-left: 1.5rem;
  margin-top: 0.75rem;
  color: #d1d5db;
}

.privacy-list li {
  margin-bottom: 0.5rem;
  line-height: 1.75;
}

.privacy-list strong {
  color: #f3f4f6;
  font-weight: 600;
}

/* Links */
.privacy-link {
  color: #60a5fa;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.privacy-link:hover {
  color: #93c5fd;
}

/* Contact Box */
.contact-box {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(75, 85, 99, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .privacy-card {
    padding: 1.25rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .subsection-title {
    font-size: 1.125rem;
  }

  .section-text {
    font-size: 0.9375rem;
  }
}
</style>
