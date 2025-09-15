<template>
  <div class="d-flex align-center ga-1">
    <v-date-input
      placeholder="дд.мм.гггг - дд.мм.гггг"
      bg-color="white"
      variant="outlined"
      density="compact"
      hide-details="auto"
      :model-value="dateValue"
      @update:model-value="updateDateRange"
      multiple="range"
      clearable
      v-bind="$attrs"
    >

    </v-date-input>
    <crud-checkbox v-model="isRange" label="Диапазон"/>
    <crud-date-picker />

  </div>


</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CrudCheckbox from "@crud/components/Inputs/CrudCheckbox.vue";
import CrudDatePicker from "@crud/components/Inputs/CrudDatePicker.vue";

interface Props {
  modelValue?: [string | null, string | null] | null | undefined
}

const isRange = ref(true)

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: [string | null, string | null] | null]
}>()

// Computed для отображения диапазона дат в компоненте
const dateValue = computed(() => {
  if (!props.modelValue || !Array.isArray(props.modelValue)) return null
  
  const [startDate, endDate] = props.modelValue
  
  if (!startDate || !endDate) return null
  
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
  } catch {
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