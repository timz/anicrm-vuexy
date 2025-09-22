<template>
  <div class="d-flex align-center ga-1">
    <VDateInput
      :placeholder="t('common.dateRange.placeholder')"
      bg-color="white"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
      :model-value="dateValue"
      multiple="range"
      clearable
      v-bind="$attrs"
      @update:model-value="updateDateRange"
    />
    <crud-checkbox v-model="isRange" :label="t('common.dateRange.range')" />
    <crud-date-picker />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VDateInput } from 'vuetify/labs/VDateInput'
import CrudCheckbox from '@crudui/components/Inputs/CrudCheckbox.vue'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'

interface Props {
  modelValue?: [string | null, string | null] | null | undefined
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: [string | null, string | null] | null]
}>()

const { t } = useI18n()
const isRange = ref(true)

// Computed для отображения диапазона дат в компоненте
const dateValue = computed(() => {
  if (!props.modelValue || !Array.isArray(props.modelValue))
    return null

  const [startDate, endDate] = props.modelValue

  if (!startDate || !endDate)
    return null

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Генерируем все даты между начальной и конечной включительно
    const dates: Date[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }
  catch {
    return null
  }
})

// Обработчик обновления диапазона дат
const updateDateRange = (dates: Date[] | null) => {
  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    emit('update:modelValue', null)

    return
  }

  // Сортируем даты по возрастанию
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime())

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // Для диапазона берем первую и последнюю дату
  const startDate = formatDate(sortedDates[0])
  const endDate = sortedDates.length > 1 ? formatDate(sortedDates[sortedDates.length - 1]) : startDate

  emit('update:modelValue', [startDate, endDate])
}
</script>
