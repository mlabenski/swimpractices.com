/**
 * Lightweight replacement for $buefy.notification used in GeneratePractice.
 */
export default defineNuxtPlugin(() => {
  const notify = {
    open ({ message, type }: { message: string; type?: string }) {
      if (import.meta.client) {
        const prefix = type === 'is-danger' ? 'Error: ' : ''
        // eslint-disable-next-line no-alert
        window.alert(`${prefix}${message}`)
      }
    },
  }

  return {
    provide: {
      buefy: { notification: notify },
    },
  }
})
