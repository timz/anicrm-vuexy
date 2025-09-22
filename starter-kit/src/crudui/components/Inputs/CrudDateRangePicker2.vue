<template>
  <div class="d-flex" style="min-width: 350px">
    <v-menu v-if="isRange" v-model="menu" :close-on-content-click="false" location="bottom start" origin="auto">
      <template #activator="{ props: menuProps }">
        <crud-input
          :model-value="displayValue"
          :label="props.label"
          :placeholder="t('common.dateRange.placeholder')"
          readonly
          v-bind="menuProps"
        />
      </template>
      <v-card class="pa-4">
        <div class="d-flex">
          <div class="flex-column me-4" style="max-width: 120px">
            <v-btn
              v-for="preset in datePresets"
              :key="preset.key"
              color="secondary"
              class="mt-1 px-2 text-caption"
              block
              size="small"
              flat
              @click="applyPreset(preset)"
            >
              {{ preset.label }}
            </v-btn>
          </div>
          <div style="width: 100%; min-width: 190px">
            <crud-date-picker v-model="startDate" style="margin-left: 2px" class="mt-2" :label="t('common.dateRange.from')" />
            <crud-date-picker v-model="endDate" style="margin-left: 2px" class="mt-4" :label="t('common.dateRange.to')" />
          </div>
        </div>
      </v-card>
    </v-menu>
    <crud-date-picker v-else v-model="viewDate" :label="props.label || t('common.dateRange.date')" />
    <crud-checkbox v-model="isRange" class="ms-1" :label="t('common.dateRange.range')" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudCheckbox from '@crudui/components/Inputs/CrudCheckbox.vue'

const props = defineProps<{
  modelValue?: string | string[] | null
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
}>()

const { t } = useI18n()
const menu = ref(false)
const isRange = ref(false)

const viewDate = ref<string | null>(null)
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

// Именованные диапазоны дат
const datePresets = computed(() => {
  const now = dayjs()

  return [
    {
      key: 'current_week',
      label: t('common.dateRange.periods.currentWeek'),
      start: now.startOf('week'),
      end: now.endOf('week'),
    },
    {
      key: 'last_week',
      label: t('common.dateRange.periods.lastWeek'),
      start: now.subtract(1, 'week').startOf('week'),
      end: now.subtract(1, 'week').endOf('week'),
    },
    {
      key: 'current_month',
      label: t('common.dateRange.periods.currentMonth'),
      start: now.startOf('month'),
      end: now.endOf('month'),
    },
    {
      key: 'last_month',
      label: t('common.dateRange.periods.lastMonth'),
      start: now.subtract(1, 'month').startOf('month'),
      end: now.subtract(1, 'month').endOf('month'),
    },
  ]
})

interface DatePreset {
  key: string
  label: string
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

// Применить пресет
const applyPreset = (preset: DatePreset) => {
  const startDateStr = preset.start.format('YYYY-MM-DD')
  const endDateStr = preset.end.format('YYYY-MM-DD')

  startDate.value = startDateStr
  endDate.value = endDateStr

  validateAndCleanup()
}

// Форматирование даты в формат ДД.ММ.ГГГГ
const formatDateForDisplay = (dateStr: string | null): string => {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime()))
    return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

// Вычисляемое значение для отображения в поле ввода
const displayValue = computed(() => {
  if (!isRange.value) {
    return formatDateForDisplay(viewDate.value)
  }

  if (startDate.value && endDate.value) {
    return `${formatDateForDisplay(startDate.value)} - ${formatDateForDisplay(endDate.value)}`
  }

  return ''
})

// Сравнение дат
const compareDates = (date1: string, date2: string): number => {
  return new Date(date1).getTime() - new Date(date2).getTime()
}

// Валидация и очистка значений при закрытии меню
const validateAndCleanup = () => {
  if (!isRange.value)
    return

  if (!startDate.value || !endDate.value) {
    startDate.value = null
    endDate.value = null

    return
  }

  // Проверка валидности дат
  const startDateObj = new Date(startDate.value)
  const endDateObj = new Date(endDate.value)

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    startDate.value = null
    endDate.value = null

    return
  }

  // Если начальная дата больше конечной, очищаем значения
  if (compareDates(startDate.value, endDate.value) > 0) {
    startDate.value = null
    endDate.value = null
  }
}

// Отслеживание закрытия меню
watch(menu, newVal => {
  if (!newVal && isRange.value) {
    validateAndCleanup()
  }
})

// Переключение режимов
watch(isRange, newVal => {
  if (newVal) {
    // Переход в режим диапазона - переносим дату в начало диапазона
    if (viewDate.value) {
      startDate.value = viewDate.value
      endDate.value = null
    }
    viewDate.value = null
  }
  else {
    // Переход в режим одной даты - очищаем диапазон
    startDate.value = null
    endDate.value = null
  }
})

// Отслеживание изменений и эмит значений
watch(
  [viewDate, startDate, endDate, isRange],
  () => {
    if (!isRange.value) {
      // Режим одной даты
      emit('update:modelValue', viewDate.value)
    }
    else {
      // Режим диапазона дат
      if (startDate.value && endDate.value) {
        const dates = [startDate.value, endDate.value]

        // Сортируем даты по возрастанию
        dates.sort((a, b) => compareDates(a, b))
        emit('update:modelValue', dates)
      }
      else {
        emit('update:modelValue', null)
      }
    }
  },
  { deep: true },
)

// Инициализация значений из props
watch(
  () => props.modelValue,
  newValue => {
    if (!newValue) {
      viewDate.value = null
      startDate.value = null
      endDate.value = null

      return
    }

    if (Array.isArray(newValue)) {
      isRange.value = true
      startDate.value = newValue[0] || null
      endDate.value = newValue[1] || null
    }
    else {
      isRange.value = false
      viewDate.value = newValue
    }
  },
  { immediate: true },
)
</script>
