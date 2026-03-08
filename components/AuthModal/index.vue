<template>
  <b-modal
    :value="open"
    title="Log In / Sign Up"
    centered
    size="md"
    class="shadow-lg bg-gray-100 rounded-lg z-350"
    hide-footer
    @input="onInput"
    @hide="close"
  >
    <div class="p-5 bg-white rounded-lg shadow-sm">
      <p class="text-gray-600 mb-4">Sign in with your account to save practices and access all features.</p>

      <b-button
        variant="primary"
        class="w-full mb-3 d-flex align-items-center justify-content-center"
        :disabled="loading"
        @click="signInWithGoogle"
      >
        <b-spinner small v-if="loading && method === 'google'" class="mr-2" />
        <span class="mr-2">Sign in with Google</span>
      </b-button>

      <hr class="my-4" />

      <b-form @submit.prevent="submitEmailAuth" class="mt-3">
        <b-form-group label="Email" label-for="auth-email">
          <b-form-input
            id="auth-email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </b-form-group>
        <b-form-group label="Password" label-for="auth-password">
          <b-form-input
            id="auth-password"
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </b-form-group>
        <b-form-group v-if="isSignUp" label="Display name" label-for="auth-displayName">
          <b-form-input
            id="auth-displayName"
            v-model="displayName"
            type="text"
            placeholder="Your name"
          />
        </b-form-group>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <b-button variant="link" class="p-0 text-secondary" @click="isSignUp = !isSignUp">
            {{ isSignUp ? "Already have an account? Log in" : "Need an account? Sign up" }}
          </b-button>
          <b-button type="submit" variant="primary" :disabled="loading">
            <b-spinner small v-if="loading && method === 'email'" class="mr-1" />
            {{ isSignUp ? "Sign up" : "Log in" }}
          </b-button>
        </div>
      </b-form>

      <p v-if="errorMessage" class="text-danger small mt-3 mb-0">{{ errorMessage }}</p>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    open(val) {
      console.log("[AuthModal] open prop changed to:", val)
    },
  },
  data() {
    return {
      loading: false,
      method: null,
      email: "",
      password: "",
      displayName: "",
      isSignUp: false,
      errorMessage: "",
    }
  },
  methods: {
    close() {
      this.$store.dispatch("auth/closeAuthModal")
      this.$emit("close")
    },
    onInput(value) {
      if (!value) {
        this.close()
      }
    },
    async signInWithGoogle() {
      this.loading = true
      this.method = "google"
      this.errorMessage = ""
      try {
        await this.$store.dispatch("auth/signInWithGoogle")
      } catch (err) {
        this.errorMessage = err.message || "Sign in with Google failed."
      } finally {
        this.loading = false
        this.method = null
      }
    },
    async submitEmailAuth() {
      this.loading = true
      this.method = "email"
      this.errorMessage = ""
      try {
        if (this.isSignUp) {
          await this.$store.dispatch("auth/signUpWithEmail", {
            email: this.email,
            password: this.password,
            displayName: this.displayName || undefined,
          })
        } else {
          await this.$store.dispatch("auth/signInWithEmail", {
            email: this.email,
            password: this.password,
          })
        }
      } catch (err) {
        this.errorMessage = err.message || "Sign in failed."
      } finally {
        this.loading = false
        this.method = null
      }
    },
  },
}
</script>
