<!-- AppInstallSuggestion.vue -->
<template>
  <transition name="slide-up">
    <div v-if="showSuggestion" class="app-install-suggestion">
      <div class="suggestion-content">
        <img :src="require('@/static/practice-logo.png')" alt="App Icon" class="app-icon">
        <div class="suggestion-text">
          <h3>{{ appName }}</h3>
          <p>Get the best experience with our app</p>
        </div>
      </div>
      <div class="suggestion-actions">
        <button @click="installApp" class="install-button">
          Install
        </button>
        <button @click="dismissSuggestion" class="dismiss-button">
          Not Now
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppInstallSuggestion',
  data() {
    return {
      showSuggestion: false,
      appName: 'Swim Practices',
      isIOS: false,
      isAndroid: false,
    };
  },
  mounted() {
    this.detectPlatform();
    this.checkIfShouldShow();
  },
  methods: {
    detectPlatform() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      this.isAndroid = /android/i.test(userAgent);
    },
    checkIfShouldShow() {
      // Check if the app is already installed
      if (this.isAppInstalled()) {
        return;
      }

      // Check if the user has dismissed the suggestion recently
      const lastDismissed = localStorage.getItem('appInstallSuggestionDismissed');
      if (lastDismissed && Date.now() - parseInt(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }

      // Show suggestion after a delay
      setTimeout(() => {
        this.showSuggestion = true;
      }, 5000);
    },
    isAppInstalled() {
      // This is a basic check and might not work for all scenarios
      return window.matchMedia('(display-mode: standalone)').matches;
    },
    installApp() {
      if (this.isIOS) {
        window.location.href = 'https://apps.apple.com/us/app/swim-practices/id6752208346';
      } else if (this.isAndroid) {
        // TODO: Update with actual Play Store URL when available
        window.location.href = 'https://play.google.com/store/apps/details?id=your.app.package';
      }
    },
    dismissSuggestion() {
      this.showSuggestion = false;
      localStorage.setItem('appInstallSuggestionDismissed', Date.now().toString());
    }
  }
};
</script>

<style scoped>
.app-install-suggestion {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.suggestion-content {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
}

.suggestion-text h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.suggestion-text p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

.install-button, .dismiss-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.install-button {
  background-color: #007aff;
  color: #ffffff;
  border: none;
}

.dismiss-button {
  background-color: transparent;
  color: #007aff;
  border: 1px solid #007aff;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>
