<template>
  <tbody :class="cn('[&_tr:last-child]:border-0', $attrs.class)">
    <slot />
  </tbody>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiTableBody',
  inheritAttrs: false,
  methods: { cn }
}
</script>
