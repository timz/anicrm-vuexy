<template>
  <v-autocomplete
    v-model="modelValue"
    :items="listOptionsFiltered"
    :label="label"
    :rules="rules"
    :multiple="multiple"
    :chips="multiple"
    :disabled="isDisabled"
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
    @update:model-value="updateValue"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { debounce } from 'lodash'
import type { CrudSelectorOptionsList } from '@crudui/components/Inputs/interfaces/CrudSelectorTypes'
import { secureApi } from '@crudui/services/AxiosService'

const props = defineProps({
  disabled: Boolean,
  modelValue: [String, Number, Array],
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

const listOptions = ref<CrudSelectorOptionsList>([])
const listOptionsFiltered = ref<CrudSelectorOptionsList>([])
const internalLoading = ref(false)

// Обновление значения
const updateValue = (value: string | number | string[] | number[] | null) => {
  emit('update:modelValue', value)
}

// Загрузка списка
const getList = async (filterStr?: string) => {
  await nextTick()

  if (props.dataOptions) {
    listOptions.value = listOptionsFiltered.value = props.dataOptions
  }
  else if (props.dataUrl) {
    try {
      internalLoading.value = true

      const requestData: any = {}

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

      const response = await secureApi.post(props.dataUrl, requestData)

      if (response?.data?.content?.list) {
        listOptions.value = listOptionsFiltered.value = response.data.content.list
      }
    }
    catch (e) {
      console.error(`Ошибка при получении списка "${props.label}"`, e)
    }
    finally {
      internalLoading.value = false
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
    updateValue(value)
  },
})

// Проверка состояния disabled
const isDisabled = computed(() => {
  return props.disabled || false
})

// Проверка состояния loading
const isLoading = computed(() => {
  return internalLoading.value || false
})

// Поиск с debounce
const onSearch = debounce(async (query: string) => {
  if (!props.useInput) {
    return
  }

  // Игнорируем поисковый запрос, если он совпадает с текущим выбранным значением
  // (это происходит при открытии селектора)
  const currentLabel = listOptions.value.find(opt => opt.value === modelValue.value)?.label
  if (query && query === currentLabel) {
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
    } else {
      // При недостаточной длине или очистке поиска возвращаем исходный список
      listOptionsFiltered.value = listOptions.value
    }
  }
}, 300)

onMounted(async () => {
  await getList()
})
</script>
