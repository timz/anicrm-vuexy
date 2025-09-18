<template>
  <v-select
    v-bind="$props"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    @blur="handleBlur"
    @focus="handleFocus"
    ref="selectRef"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import commonProps from '@crudui/components/Inputs/interfaces/CommonProps'

defineProps({
  ...commonProps,
  items: {
    type: Array,
    default: () => [],
  },
  itemTitle: {
    type: String,
    default: 'title',
  },
  itemValue: {
    type: String,
    default: 'value',
  },
})

const selectRef = ref()
const hasBeenFocused = ref(false)

const handleFocus = () => {
  hasBeenFocused.value = true
}

const handleBlur = () => {
  if (hasBeenFocused.value && selectRef.value) {
    selectRef.value.validate()
  }
}
</script>