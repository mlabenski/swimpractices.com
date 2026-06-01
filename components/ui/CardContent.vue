<template>
  <div :class="cn('p-6 pt-0', $attrs.class)">
    <slot />
  </div>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiCardContent',
  inheritAttrs: false,
  methods: { cn }
}
</script>
