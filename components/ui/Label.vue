<template>
  <label :class="classes" v-bind="$attrs">
    <slot />
  </label>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiLabel',
  inheritAttrs: false,
  computed: {
    classes () {
      return cn(
        'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        this.$attrs.class
      )
    }
  }
}
</script>
