<template>
  <v-select
    ref="selectRef"
    v-model="model"
    :items="items"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :item-title="itemTitle"
    :item-value="itemValue"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label?: string
  rules?: any[]
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  itemTitle?: string
  itemValue?: string
}>()

const model = defineModel()

const selectRef = ref()
const hasBeenFocused = ref(false)

const items = ref([{ title: '', value: null }, { title: 'Да', value: true }, { title: 'Нет', value: false }])

const handleFocus = () => {
  hasBeenFocused.value = true
}

const handleBlur = () => {
  if (hasBeenFocused.value && selectRef.value) {
    selectRef.value.validate()
  }
}
</script>
