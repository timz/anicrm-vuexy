<template>
  <v-text-field
    v-if="type !== 'textarea'"
    v-bind="$props"
    ref="inputRef"
    variant="outlined"
    density="comfortable"
    clearable
    hide-details="auto"
    @blur="handleBlur"
    @focus="handleFocus"
  />
  <v-textarea
    v-else
    v-bind="$props"
    ref="inputRef"
    variant="outlined"
    density="comfortable"
    clearable
    hide-details="auto"
    bg-color="white"
    auto-grow
    rows="2"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

import commonProps from '@crudui/components/Inputs/interfaces/CommonProps'
import type { AvailableTypesForInputsType } from '@crudui/components/Inputs/interfaces/AvailableTypesForInputsType'

defineProps({
  ...commonProps,
  type: {
    type: String as PropType<AvailableTypesForInputsType>,
    default: 'text',
  },
})

const inputRef = ref()
const hasBeenFocused = ref(false)

const handleFocus = () => {
  hasBeenFocused.value = true
}

const handleBlur = () => {
  if (hasBeenFocused.value && inputRef.value) {
    inputRef.value.validate()
  }
}
</script>
