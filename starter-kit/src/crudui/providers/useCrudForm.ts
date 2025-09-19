import type { Ref } from 'vue'
import { computed, nextTick, ref, toRaw, watch } from 'vue'
import type { AxiosInstance } from 'axios'
import { api, secureApi } from '@crudui/services/AxiosService'
import type { CrudResponse, FormModel, HttpConfig, ModelConfig } from '@crudui/types'

// Интерфейс формы для совместимости с Vuetify
export interface VForm {
  validate(): Promise<{ valid: boolean; errors: unknown[] }>
  resetValidation(): void
}

// Конечный интерфейс через пересечение
export type QFormConfig<T extends FormModel = FormModel> = HttpConfig & ModelConfig<T> & {
  url: string
  requestKey?: string | false // false = корень, string = кастомный ключ, undefined = 'model'
}

export interface UseCrudFormReturn<T extends FormModel = FormModel> {
  readonly model: Ref<T>
  readonly stateLoading: Ref<boolean>
  readonly stateSubmitting: Ref<boolean>
  readonly stateProcessing: Ref<boolean>
  readonly stateValid: Ref<boolean>
  readonly isLoaded: Ref<boolean>
  readonly formRef: Ref<VForm | undefined>
  readonly load: (additionalData?: Record<string, unknown>) => Promise<unknown>
  readonly submit: (additionalData?: Record<string, unknown>) => Promise<unknown>
  readonly reset: () => Promise<void>
  readonly validate: () => Promise<boolean>
  readonly updateModelFromResponse: (data: CrudResponse) => Promise<void>
  readonly setLoaded: (loaded: boolean) => void
}

export function useCrudForm<T extends FormModel = FormModel>(cfg: QFormConfig<T>): UseCrudFormReturn<T> {
  const http: AxiosInstance = cfg.isSecure !== false ? secureApi : api
  const initial = JSON.parse(JSON.stringify(cfg.model.value))
  const responseKey = 'model' // По умолчанию используем 'model'

  // Логика обработки requestKey
  let requestKey: string | null
  if (cfg.requestKey === undefined) {
    requestKey = 'model' // По умолчанию 'model'
  }
  else if (cfg.requestKey === false) {
    requestKey = null // false = поля в корне
  }
  else {
    requestKey = cfg.requestKey // string = кастомный ключ
  }

  const model = cfg.model
  const stateLoading = ref<boolean>(false)
  const stateSubmitting = ref<boolean>(false)
  const formRef = ref<VForm>()
  const stateValid = ref<boolean>(false)
  const hasUserInteraction = ref<boolean>(false)
  const isLoaded = ref<boolean>(false)

  // Функция валидации для переиспользования
  async function performValidation(): Promise<boolean> {
    // Валидируем только если была хотя бы одна попытка взаимодействия
    if (!hasUserInteraction.value) {
      return true
    }
    const result = await formRef.value?.validate()
    const isValid = result?.valid ?? true

    stateValid.value = isValid

    return isValid
  }

  // Отслеживание изменений модели только для отметки взаимодействия
  watch(
    model,
    () => {
      // Отмечаем что было взаимодействие с формой
      hasUserInteraction.value = true

      // Убираем автоматическую валидацию при изменении
      // void performValidation()
    },
    { deep: true },
  )

  // Отслеживание готовности formRef - без немедленной валидации
  watch(
    formRef,
    async newFormRef => {
      if (newFormRef) {
        await nextTick()

        // Сбрасываем валидацию при инициализации формы
        newFormRef.resetValidation()

        // Не валидируем при инициализации
        stateValid.value = true
        hasUserInteraction.value = false
      }
    },
    { immediate: true },
  )

  // Computed для общего статуса обработки
  const stateProcessing = computed<boolean>(() =>
    stateLoading.value || stateSubmitting.value,
  )

  // Общая логика обновления модели из ответа сервера
  async function updateModelFromResponse(data: CrudResponse): Promise<void> {
    const responseData = data.content?.[responseKey]
    if (responseData) {
      Object.assign(model.value, cfg.transformIn ? cfg.transformIn(responseData) : (responseData as FormModel))
    }
    await nextTick()
    formRef.value?.resetValidation()

    // При загрузке данных с сервера не показываем ошибки валидации
    stateValid.value = true
  }

  async function load(additionalData?: Record<string, unknown>): Promise<unknown> {
    stateLoading.value = true
    try {
      const { data } = await http.post(cfg.url, additionalData ?? {})

      await updateModelFromResponse(data)
      isLoaded.value = true

      return data
    }
    finally {
      stateLoading.value = false
    }
  }

  async function validate(): Promise<boolean> {
    // При явном вызове validate() всегда выполняем валидацию
    hasUserInteraction.value = true

    return await performValidation()
  }

  async function submit(additionalData?: Record<string, unknown>): Promise<unknown> {
    const formIsValid = await validate()
    if (!formIsValid) {
      return Promise.reject(new Error('Validation failed'))
    }

    stateSubmitting.value = true
    try {
      const rawModel = toRaw(model.value)
      const modelData = cfg.transformOut ? cfg.transformOut(rawModel) : rawModel

      let payload: Record<string, unknown>
      if (requestKey === null) {
        // Если requestKey = null, поля идут в корень
        payload = { ...(modelData as Record<string, unknown>), ...additionalData }
      }
      else {
        // Иначе оборачиваем в указанный ключ
        payload = { [requestKey]: modelData, ...additionalData }
      }

      const { data } = await http.post(cfg.url, payload)

      return data
    }
    finally {
      stateSubmitting.value = false
    }
  }

  async function reset(): Promise<void> {
    Object.assign(model.value, initial)
    hasUserInteraction.value = false
    isLoaded.value = false
    await nextTick()
    formRef.value?.resetValidation()
    stateValid.value = true
  }

  function setLoaded(loaded: boolean): void {
    isLoaded.value = loaded
  }

  return {
    model,
    stateLoading,
    stateSubmitting,
    stateProcessing,
    stateValid,
    isLoaded,
    formRef,
    load,
    submit,
    reset,
    validate,
    updateModelFromResponse,
    setLoaded,
  } as const
}
