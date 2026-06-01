<template>
  <th
    :class="cn(
      'h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      $attrs.class
    )"
  >
    <slot />
  </th>
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiTableHead',
  inheritAttrs: false,
  methods: { cn }
}
</script>
