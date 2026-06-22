<template>
  <!-- `dark` scopes shadcn tokens (popover/card/border) to dark so the menu fits the hero -->
  <div ref="root" class="dark relative inline-block text-left">
    <!-- Trigger: hamburger on mobile, icon + label on larger screens -->
    <button
      type="button"
      :class="cn(
        'inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
      )"
      :aria-expanded="open"
      aria-haspopup="true"
      aria-label="Open product roadmap menu"
      @click="toggle"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span class="hidden sm:inline">Roadmap</span>
      <svg
        class="hidden h-4 w-4 transition-transform duration-200 sm:inline"
        :class="{ 'rotate-180': open }"
        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown panel -->
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl"
        role="menu"
      >
        <div class="px-4 pb-2 pt-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product Roadmap
          </p>
        </div>
        <UiSeparator />

        <button
          v-for="item in items"
          :key="item.title"
          type="button"
          class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          role="menuitem"
          @click="select(item)"
        >
          <span class="text-sm font-medium leading-tight">{{ item.title }}</span>
          <UiBadge variant="outline" :class="cn('shrink-0', statusClass(item.status))">
            {{ item.status }}
          </UiBadge>
        </button>

        <UiSeparator />
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
          role="menuitem"
          @click="select({ route: '/roadmap' })"
        >
          <span>View full roadmap</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { cn } from '@/lib/utils'
import UiBadge from '@/components/ui/Badge.vue'
import UiSeparator from '@/components/ui/Separator.vue'

export default {
  name: 'RoadmapMenu',
  components: { UiBadge, UiSeparator },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['navigate'],
  data () {
    return {
      open: false,
    }
  },
  mounted () {
    document.addEventListener('click', this.onClickOutside)
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount () {
    document.removeEventListener('click', this.onClickOutside)
    document.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    cn,
    toggle () {
      this.open = !this.open
    },
    select (item) {
      this.open = false
      if (item && item.route) {
        this.$emit('navigate', item.route)
      }
    },
    onClickOutside (event) {
      if (this.open && this.$refs.root && !this.$refs.root.contains(event.target)) {
        this.open = false
      }
    },
    onKeydown (event) {
      if (event.key === 'Escape') {
        this.open = false
      }
    },
    statusClass (status) {
      if (status && status.includes('Available')) {
        return 'border-green-500/40 bg-green-500/10 text-green-400'
      }
      if (status && status.includes('Development')) {
        return 'border-blue-500/40 bg-blue-500/10 text-blue-400'
      }
      if (status && (status.includes('2026') || status.includes('Coming'))) {
        return 'border-amber-400/40 bg-amber-400/10 text-amber-300'
      }
      return 'border-border bg-muted text-muted-foreground'
    },
  },
}
</script>
