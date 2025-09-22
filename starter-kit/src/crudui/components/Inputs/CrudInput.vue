<template>
  <v-text-field
    v-if="type !== 'textarea'"
    ref="inputRef"
    v-model="model"
    :type="type"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    @blur="handleBlur"
    @focus="handleFocus"
  />
  <v-textarea
    v-else
    ref="inputRef"
    v-model="model"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    bg-color="white"
    auto-grow
    rows="2"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AvailableTypesForInputsType } from '@crudui/components/Inputs/interfaces/AvailableTypesForInputsType'

defineProps<{
  type?: AvailableTypesForInputsType
  label?: string
  rules?: any[]
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
}>()

const model = defineModel()

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
