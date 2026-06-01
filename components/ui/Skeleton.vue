<template>
  <div :class="cn('animate-pulse rounded-md bg-muted', $attrs.class)" />
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiSkeleton',
  inheritAttrs: false,
  methods: { cn }
}
</script>
