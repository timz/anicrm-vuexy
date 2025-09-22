<template>
  <v-text-field
    ref="inputRef"
    v-model="formattedValue"
    type="text"
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
    @input="handleInput"
  >
    <template #append-inner>
      <span class="text-primary">$</span>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  label?: string
  rules?: any[]
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  decimals?: number
}>()

const model = defineModel<number | null>()

const inputRef = ref()
const hasBeenFocused = ref(false)

const formattedValue = computed({
  get() {
    if (model.value === null || model.value === undefined) return ''

    const decimals = props.decimals ?? 2
    return model.value.toFixed(decimals)
  },
  set(value: string) {
    if (!value || value === '') {
      model.value = null
      return
    }

    const cleanedValue = value.replace(/[^0-9.-]/g, '')
    const numericValue = parseFloat(cleanedValue)

    if (!isNaN(numericValue)) {
      model.value = numericValue
    }
  }
})

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  const cleanedValue = value.replace(/[^0-9.-]/g, '')

  if (value !== cleanedValue) {
    input.value = cleanedValue
    formattedValue.value = cleanedValue
  }
}

const handleFocus = () => {
  hasBeenFocused.value = true
}

const handleBlur = () => {
  if (hasBeenFocused.value && inputRef.value) {
    inputRef.value.validate()
  }
}
</script>
