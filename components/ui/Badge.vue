<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export default {
  name: 'UiBadge',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    classes () {
      return cn(badgeVariants({ variant: this.variant }), this.$attrs.class)
    }
  }
}
</script>
