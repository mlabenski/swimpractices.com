<template>
  <UiDialog
    :open="open"
    title-id="auth-dialog-title"
    @update:open="onDialogOpenChange"
    @close="close"
  >
    <div class="space-y-6 pr-6">
      <div class="space-y-2">
        <h2 id="auth-dialog-title" class="text-lg font-semibold leading-none tracking-tight">
          Log in / Sign up
        </h2>
        <p class="text-sm text-muted-foreground">
          Sign in with your account to save practices and access all features.
        </p>
      </div>

      <UiButton
        variant="outline"
        class="w-full h-11"
        :disabled="loading"
        @click="signInWithGoogle"
      >
        <span
          v-if="loading && method === 'google'"
          class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
        <svg
          v-else
          class="h-4 w-4"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </UiButton>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-border" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-card px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="submitEmailAuth">
        <div class="space-y-2">
          <UiLabel for="auth-email">Email</UiLabel>
          <UiInput
            id="auth-email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="space-y-2">
          <UiLabel for="auth-password">Password</UiLabel>
          <UiInput
            id="auth-password"
            v-model="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            required
          />
        </div>
        <div v-if="isSignUp" class="space-y-2">
          <UiLabel for="auth-displayName">Display name</UiLabel>
          <UiInput
            id="auth-displayName"
            v-model="displayName"
            type="text"
            placeholder="Your name"
            autocomplete="name"
          />
        </div>

        <div
          v-if="errorMessage"
          class="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UiButton
            type="button"
            variant="link"
            class="h-auto px-0 text-muted-foreground"
            @click="isSignUp = !isSignUp"
          >
            {{ isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up' }}
          </UiButton>
          <UiButton type="submit" :disabled="loading">
            <span
              v-if="loading && method === 'email'"
              class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"
              aria-hidden="true"
            />
            {{ isSignUp ? 'Sign up' : 'Log in' }}
          </UiButton>
        </div>
      </form>
    </div>
  </UiDialog>
</template>

<script>
import UiDialog from '@/components/ui/Dialog.vue'
import UiButton from '@/components/ui/Button.vue'
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'

export default {
  components: {
    UiDialog,
    UiButton,
    UiInput,
    UiLabel
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data () {
    return {
      loading: false,
      method: null,
      email: '',
      password: '',
      displayName: '',
      isSignUp: false,
      errorMessage: ''
    }
  },
  watch: {
    open (val) {
      if (!val) {
        this.resetForm()
      }
    }
  },
  methods: {
    onDialogOpenChange (val) {
      if (!val) {
        this.close()
      }
    },
    resetForm () {
      this.errorMessage = ''
      this.loading = false
      this.method = null
    },
    close () {
      this.$store.dispatch('auth/closeAuthModal')
      this.$emit('close')
    },
    authError (err) {
      const msg = err && (err.message || err.code || String(err))
      const known = {
        'auth/popup-closed-by-user': 'Sign-in was cancelled.',
        'auth/popup-blocked': 'Sign-in popup was blocked. Allow popups for this site.',
        'auth/cancelled-popup-request': 'Sign-in was cancelled.',
        'auth/unauthorized-domain': 'This domain is not authorized for sign-in. Check Firebase Console.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/wrong-password': 'Invalid email or password.',
        'auth/user-not-found': 'No account found for this email.',
        'auth/email-already-in-use': 'This email is already registered. Try logging in.',
        'auth/weak-password': 'Password should be at least 6 characters.'
      }
      return known[err && err.code] || msg || 'Sign-in failed.'
    },
    async signInWithGoogle () {
      this.loading = true
      this.method = 'google'
      this.errorMessage = ''
      try {
        await this.$store.dispatch('auth/signInWithGoogle')
        this.close()
      } catch (err) {
        this.errorMessage = this.authError(err)
      } finally {
        this.loading = false
        this.method = null
      }
    },
    async submitEmailAuth () {
      this.loading = true
      this.method = 'email'
      this.errorMessage = ''
      try {
        if (this.isSignUp) {
          await this.$store.dispatch('auth/signUpWithEmail', {
            email: this.email,
            password: this.password,
            displayName: this.displayName || undefined
          })
        } else {
          await this.$store.dispatch('auth/signInWithEmail', {
            email: this.email,
            password: this.password
          })
        }
        this.close()
      } catch (err) {
        this.errorMessage = this.authError(err)
      } finally {
        this.loading = false
        this.method = null
      }
    }
  }
}
</script>
