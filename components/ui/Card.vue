<template>
  <div :class="cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', $attrs.class)">
    <slot />
  </div>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiCard',
  inheritAttrs: false,
  methods: { cn }
}
</script>
