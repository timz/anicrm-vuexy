<template>
  <v-select
    v-bind="$props"
    variant="outlined"
    density="compact"
    hide-details="auto"
    @blur="handleBlur"
    @focus="handleFocus"
    ref="selectRef"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import commonProps from '@crud/components/Inputs/interfaces/CommonProps'

defineProps({
  ...commonProps,
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

const items = ref([{title: '', value: null}, {title: 'Да', value: true}, {title: 'Нет', value: false}])

const handleFocus = () => {
  hasBeenFocused.value = true
}

const handleBlur = () => {
  if (hasBeenFocused.value && selectRef.value) {
    selectRef.value.validate()
  }
}
</script>