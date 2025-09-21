<template>
  <v-autocomplete
    v-model="modelValue"
    :items="listOptionsFiltered"
    :label="label"
    :rules="rules"
    :multiple="multiple"
    :chips="multiple"
    :disabled="disabled"
    :loading="isLoading"
    clearable
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    bg-color="surface"
    item-title="label"
    item-value="value"
    :return-object="false"
    @update:search="onSearch"
    @update:model-value="onModelValueUpdate"
    @click:clear="onClear"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { debounce } from 'lodash'
import type { CrudSelectorOptionsList } from '@crudui/components/Inputs/interfaces/CrudSelectorTypes'
import { secureApi } from '@crudui/services/AxiosService'
import { useNotifications } from '@crudui/composables/useNotifications'

// Интерфейсы для типизации
interface CrudSelectorRequest {
  filter?: string
  id?: string | number | Array<string | number>
  [key: string]: unknown
}

interface CrudSelectorResponse {
  data: {
    content: {
      list: CrudSelectorOptionsList
    }
  }
}

const props = defineProps({
  disabled: Boolean,
  modelValue: [String, Number, Array] as PropType<string | number | string[] | number[] | null>,
  label: {
    type: String,
    default: undefined,
  },
  rules: {
    type: Array as () => Array<(value: any) => string | boolean>,
    default: () => [],
  },
  dataOptions: Array as () => CrudSelectorOptionsList,
  dataUrl: String,
  extraRequestData: {
    type: Object,
    default: null,
  },
  useInput: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | string[] | number[] | null]
}>()

const { showError } = useNotifications()

const listOptions = ref<CrudSelectorOptionsList>([])
const listOptionsFiltered = ref<CrudSelectorOptionsList>([])
const isLoading = ref(false)
const lastSearchQuery = ref<string>('')

// Установка опций
const setOptions = (options: CrudSelectorOptionsList) => {
  listOptions.value = options
  listOptionsFiltered.value = options
}

// Загрузка списка
const getList = async (filterStr?: string) => {
  if (props.dataOptions) {
    setOptions(props.dataOptions)
  }
  else if (props.dataUrl) {
    try {
      isLoading.value = true

      const requestData: CrudSelectorRequest = {}

      if (filterStr) {
        requestData.filter = filterStr
      }

      // Добавляем текущее значение для загрузки
      const currentValue = modelValue.value
      if (currentValue) {
        requestData.id = Array.isArray(currentValue) ? currentValue : currentValue
      }

      if (props.extraRequestData) {
        Object.assign(requestData, props.extraRequestData)
      }

      const response = await secureApi.post<CrudSelectorResponse['data']>(props.dataUrl, requestData)

      if (response?.data?.content?.list) {
        setOptions(response.data.content.list)
      }
    }
    catch (e) {
      showError(`Ошибка при загрузке списка ${props.label || ''}`)
      console.error(e)
    }
    finally {
      isLoading.value = false
    }
  }
  else {
    console.error(`Необходимо указать dataOptions или dataUrl для "${props.label}"`)
  }
}

// Вычисляемое свойство для v-model
const modelValue = computed({
  get(): string | number | string[] | number[] | null {
    return props.modelValue || null
  },
  set(value: string | number | string[] | number[] | null) {
    emit('update:modelValue', value)
  },
})

// Получение текущих label(ов) для выбранных значений
const getCurrentLabels = () => {
  const value = modelValue.value
  if (!value)
    return []

  const values = Array.isArray(value) ? value : [value]

  return values.map(v => listOptions.value.find(opt => opt.value === v)?.label).filter(Boolean)
}

// Поиск с debounce
const onSearch = debounce(async (query: string) => {
  if (!props.useInput) {
    return
  }

  // Сохраняем последний поисковый запрос
  lastSearchQuery.value = query || ''

  // Игнорируем поисковый запрос, если он совпадает с текущим выбранным значением
  // (это происходит при открытии селектора)
  const currentLabels = getCurrentLabels()
  if (query && currentLabels.includes(query)) {
    return
  }

  if (props.dataOptions) {
    // Фильтрация локальных данных - начинаем с 3 символов
    if (!query || query.length < 3) {
      listOptionsFiltered.value = listOptions.value

      return
    }

    const needle = query.toLowerCase()

    listOptionsFiltered.value = listOptions.value.filter(option => option.label.toLowerCase().includes(needle))
  }
  else if (props.dataUrl) {
    // Загрузка данных с сервера только если введено минимум 3 символа
    if (query && query.trim().length >= 3) {
      await getList(query)
    }
    else {
      // При недостаточной длине или очистке поиска возвращаем исходный список
      listOptionsFiltered.value = listOptions.value
    }
  }
}, 300)

// Обработчик изменения значения
const onModelValueUpdate = async (value: string | number | string[] | number[] | null) => {
  // Эмитим новое значение
  emit('update:modelValue', value)

  // Если был активный фильтр и выбрано значение, очищаем фильтр и перезагружаем список
  if (lastSearchQuery.value && value !== null) {
    lastSearchQuery.value = ''

    // Перезагружаем полный список без фильтрации
    if (props.dataUrl) {
      await getList()
    }
    else if (props.dataOptions) {
      // Для локальных данных просто сбрасываем фильтр
      listOptionsFiltered.value = listOptions.value
    }
  }
}

// Обработчик очистки поля
const onClear = async () => {
  // Сбрасываем последний поисковый запрос
  lastSearchQuery.value = ''

  // При очистке загружаем список без фильтрации
  if (props.dataUrl) {
    await getList()
  }
}

onMounted(async () => {
  await getList()
})
</script>
