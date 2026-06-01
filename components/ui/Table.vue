<template>
  <div class="relative w-full overflow-auto">
    <table :class="cn('w-full caption-bottom text-sm', $attrs.class)">
      <slot />
    </table>
  </div>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiTable',
  inheritAttrs: false,
  methods: { cn }
}
</script>
