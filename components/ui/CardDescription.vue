<template>
  <p :class="cn('text-sm text-muted-foreground', $attrs.class)">
    <slot />
  </p>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiCardDescription',
  inheritAttrs: false,
  methods: { cn }
}
</script>
