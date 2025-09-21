<template>
  <q-select
    outlined
    :multiple="multiple"
    :use-chips="multiple"
    bg-color="white"
    dense
    clearable
    hideBottomSpace
    :rules="props.rules"
    v-model="formProvider.model.value[field]"
    :label="label"
    :disable="internalLoading || disabled || formProvider.loading.value || disableForm"
    :input-debounce="300"
    :loading="internalLoading || formProvider.loading.value"
    :options="listOptionsFiltered"
    emit-value
    map-options
    options-dense
    :use-input="useInput"
    @filter="onFilter"
  />
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted, inject} from 'vue'
import {secureApi} from '@crud/services/AxiosService'
import type {CrudSelectorOptionsList} from '@crud/components/Inputs/interfaces/CrudSelectorOptionInterface'
import type {FormProvider} from '@crud/providers/form/FormProvider'
import type {ValidationRule} from 'quasar'
import {useDisableForm} from '@crud/components/data/helpers/useDisableForm'

const props = defineProps({
  disabled: Boolean,
  modelValue: [String, Number],
  label: {
    type: String,
    default: undefined,
  },
  rules: {
    type: Array as () => ValidationRule[],
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
  field: String,
  providerName: {
    type: String,
    default: 'formProvider',
  },
})

const formProvider:FormProvider = inject(props.providerName)

const listOptions = ref<CrudSelectorOptionsList>([])
const listOptionsFiltered = ref<CrudSelectorOptionsList>([])
const internalLoading = ref(false)

// Инъектируем состояние disabled
const disableForm = useDisableForm()

const onFilter = (query: string, update: (callback: () => void) => void) => {
  if (query === '') {
    update(() => {
      listOptionsFiltered.value = listOptions.value
    })
    return
  }
  update(() => {
    const needle = query.toLowerCase()
    listOptionsFiltered.value = listOptions.value.filter((option) => option.label.toLowerCase().includes(needle))
  })
}

const getList = async (filterStr?: string) => {
  // const lbl = formProvider.label(<string>props.field) || 'CrudSelectorClient'
  await nextTick()

  if (props.dataOptions) {
    listOptions.value = listOptionsFiltered.value = props.dataOptions
  } else if (props.dataUrl) {
    try {
      internalLoading.value = true

      const filterData = filterStr ? {filterStr: filterStr} : {}


      const id = formProvider.model.value[props.field]

      if (id) {

        filterData['id'] = id
      }
      if (props.extraRequestData) {
        Object.assign(filterData, props.extraRequestData)
      }

      const response = await secureApi.post(props.dataUrl, {
        filter: filterData,
      })
      if (response) listOptions.value = listOptionsFiltered.value = response.data.result.list
    } catch (e) {
      console.error(`Ошибка при получении списка "${props.label}"`, e)
    } finally {
      internalLoading.value = false
    }
  } else {
    console.error(`Необходимо указать dataOptions или dataUrl для "${lbl}"`)
  }
}

onMounted(async () => {
  await getList()
})
</script>
