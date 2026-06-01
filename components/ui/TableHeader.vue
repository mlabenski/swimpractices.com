<template>
  <thead :class="cn('[&_tr]:border-b', $attrs.class)">
    <slot />
  </thead>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiTableHeader',
  inheritAttrs: false,
  methods: { cn }
}
</script>
