<template>
  <input
    :class="classes"
    :type="type"
    :value="modelValue"
    v-bind="inputAttrs"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script>
import { cn } from '@/lib/utils'

export default {
  name: 'UiInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  emits: ['update:modelValue'],
  computed: {
    inputAttrs () {
      const { class: _class, ...rest } = this.$attrs
      return rest
    },
    classes () {
      return cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        this.$attrs.class
      )
    }
  }
}
</script>
