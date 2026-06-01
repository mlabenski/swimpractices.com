<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[350] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div
        class="fixed inset-0 bg-black/80 animate-in fade-in-0"
        aria-hidden="true"
        @click="onClose"
      />
      <div
        :class="cn(
          'relative z-[351] w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
          contentClass
        )"
        @keydown.escape="onClose"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
          @click="onClose"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiDialog',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    contentClass: {
      type: String,
      default: ''
    },
    titleId: {
      type: String,
      default: 'dialog-title'
    }
  },
  emits: ['update:open', 'close'],
  methods: {
    cn,
    onClose () {
      this.$emit('update:open', false)
      this.$emit('close')
    }
  }
}
</script>
