<template>
  <div
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      $attrs.class
    )"
    role="separator"
    :aria-orientation="orientation"
  />
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiSeparator',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (v) => ['horizontal', 'vertical'].includes(v)
    }
  },
  methods: { cn }
}
</script>
