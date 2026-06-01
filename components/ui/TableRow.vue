<template>
  <tr :class="cn('border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', $attrs.class)">
    <slot />
  </tr>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiTableRow',
  inheritAttrs: false,
  methods: { cn }
}
</script>
