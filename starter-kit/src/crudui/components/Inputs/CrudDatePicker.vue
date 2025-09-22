<template>
  <VDateInput
    prepend-icon=""
    :placeholder="$t('common.dateFormat')"
    bg-color="white"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    :model-value="dateValue"
    clearable
    v-bind="$attrs"
    @update:model-value="updateDate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'

interface Props {
  modelValue?: string | null | undefined
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

// Computed для отображения даты в компоненте
const dateValue = computed(() => {
  if (!props.modelValue || props.modelValue === undefined)
    return null

  // Если приходит дата в ISO формате, конвертируем в Date объект
  try {
    return new Date(props.modelValue)
  }
  catch {
    return null
  }
})

// Обработчик обновления даты
const updateDate = (date: Date | null) => {
  if (!date) {
    emit('update:modelValue', null)

    return
  }

  // Конвертируем Date в ISO строку (YYYY-MM-DD)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  emit('update:modelValue', `${year}-${month}-${day}`)
}
</script>
