import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import type { AxiosError, AxiosInstance } from 'axios'

import { type QFormConfig, type UseCrudFormReturn, useCrudForm } from './useCrudForm'
import { api, secureApi } from '@crudui/services/AxiosService'
import { notifications } from '@crudui/boot/notification'
import type { CrudResponse, FormConfig, FormModel, HttpConfig, ModelConfig, UrlConfig } from '@crudui/types'

interface ValidationErrorResponse {
  error: string | Record<string, string>
}

function formatValidationError(errorData: string | Record<string, string>): string {
  if (typeof errorData === 'string') {
    return `<div class="q-mb-sm">При отправке данных возникла ошибка:</div>${errorData}`
  }

  const errorsList = Object.values(errorData)
    .map(error => `<li>${error}</li>`)
    .join('')

  return `<div class="q-mb-sm">При отправке данных возникли ошибки:</div><ol style="margin: 0; padding-left: 20px;">${errorsList}</ol>`
}

function handleSubmitError(error: AxiosError<ValidationErrorResponse>): never {
  if (error.response?.status === 422 && error.response.data?.error) {
    const errorMessage = formatValidationError(error.response.data.error)

    notifications.warning(errorMessage)
  }
  else {
    const errorMessage = (error.response?.data?.error as string) || 'Произошла ошибка при сохранении'

    notifications.warning(errorMessage)
  }
  throw error
}

// Конечный интерфейс через пересечение
export type CrudDataFormConfig<T extends FormModel = FormModel> = HttpConfig & ModelConfig<T> & UrlConfig & FormConfig

export interface CrudDataFormReturn<T extends FormModel = FormModel> extends UseCrudFormReturn<T> {
  readonly isCreateMode: ComputedRef<boolean>
  readonly currentUrl: ComputedRef<string>
  readonly version: Ref<string | null>
  readonly forcedSave: Ref<boolean>
  readonly isDataReady: ComputedRef<boolean>
}

export function useCrudDataForm<T extends FormModel = FormModel>(
  cfg: CrudDataFormConfig<T>,
): CrudDataFormReturn<T> {
  const version = ref<string | null>(null)
  const forcedSave = ref<boolean>(false)

  // Значения по умолчанию
  const primaryKey = cfg.primaryKey ?? 'id'
  const loadUrl = cfg.loadUrl ?? '/view'
  const createUrl = cfg.createUrl ?? '/create'
  const updateUrl = cfg.updateUrl ?? '/update'
  const successMessage = cfg.successMessage ?? 'Запись успешно сохранена'

  // Определяем режим создания на основе наличия PK
  const isCreateMode = computed<boolean>(() => {
    const pkValue = cfg.model.value[primaryKey as keyof T] as string | number | null | undefined

    return !pkValue
  })

  // Динамически выбираем URL для операций
  const currentUrl = computed<string>(() =>
    isCreateMode.value
      ? `${cfg.prefixUrl}${createUrl}`
      : `${cfg.prefixUrl}${updateUrl}`,
  )

  // URL для загрузки данных
  const loadDataUrl = `${cfg.prefixUrl}${loadUrl}`

  // Создаем базовый config с динамическим URL
  const baseConfig: QFormConfig<T> = {
    ...cfg,
    url: currentUrl.value,
    requestKey: 'model', // Всегда используем 'model' для useCrudDataForm
    transformIn: cfg.transformIn || ((raw: unknown) => raw as T),
  }

  // Создаем базовый форм
  const baseForm = useCrudForm<T>(baseConfig)

  // Единая логика готовности данных
  const isDataReady = computed<boolean>(() => {
    // Для создания данные всегда готовы
    if (isCreateMode.value)
      return true

    // Для редактирования данные готовы если загружены
    return baseForm.isLoaded.value
  })

  // Переопределяем метод load для использования loadUrl
  const load = async (additionalData?: Record<string, unknown>): Promise<unknown> => {
    // Формируем URL для загрузки с id в пути
    const originalUrl = baseConfig.url
    const pkValue = cfg.model.value[primaryKey as keyof T] as string | number | null | undefined

    // Добавляем ID в URL если есть
    baseConfig.url = pkValue ? `${loadDataUrl}/${pkValue}` : loadDataUrl

    try {
      const result = await baseForm.load(additionalData)

      // Извлекаем версию из ответа
      if (result && typeof result === 'object' && 'content' in result) {
        const data = result as CrudResponse
        if (data.content?.version && typeof data.content.version === 'string') {
          version.value = data.content.version
        }
      }

      return result
    }
    finally {
      // Восстанавливаем оригинальный URL
      baseConfig.url = originalUrl
    }
  }

  // Переопределяем метод submit для обработки версионности и уведомлений
  const submit = async (additionalData?: Record<string, unknown>): Promise<unknown> => {
    const wasCreateMode = isCreateMode.value
    const http: AxiosInstance = cfg.isSecure !== false ? secureApi : api

    try {
      // Подготавливаем payload с версионностью
      const versionData: Record<string, unknown> = {}

      // Для обновления добавляем version и forcedSave
      if (!wasCreateMode) {
        if (version.value) {
          versionData.version = version.value
        }
        versionData.forcedSave = forcedSave.value
      }

      const payload = {
        ...additionalData,
        ...versionData,
      }

      // Логика для режима создания
      if (wasCreateMode) {
        // При создании исключаем primaryKey из payload

        const { [primaryKey]: _, ...modelWithoutPK } = cfg.model.value

        // Применяем transformOut к модели БЕЗ primaryKey
        const modelData = cfg.transformOut ? cfg.transformOut(modelWithoutPK as T) : modelWithoutPK

        // Обновляем URL перед отправкой
        baseConfig.url = currentUrl.value

        // Отправляем данные в формате { model: {...} } - всегда используем 'model'
        const createPayload = { model: modelData, ...payload }
        const { data } = await http.post(baseConfig.url, createPayload)

        // Обрабатываем результат - обновляем ОРИГИНАЛЬНУЮ модель с новым ID
        if (data && typeof data === 'object' && 'content' in data) {
          const responseData = data as CrudResponse

          await baseForm.updateModelFromResponse(responseData)

          // Извлекаем версию из ответа после успешного сохранения
          if (responseData.content?.version && typeof responseData.content.version === 'string') {
            version.value = responseData.content.version
          }
        }

        // ВАЖНО: После создания записи помечаем данные как загруженные
        baseForm.setLoaded(true)

        // Сбрасываем флаг принудительного сохранения
        forcedSave.value = false

        // Показываем уведомление об успехе
        notifications.positive(successMessage)

        return data
      }

      // Обновляем URL перед отправкой
      baseConfig.url = currentUrl.value

      const result = await baseForm.submit(payload)

      // Обновляем модель из ответа сервера (используем функцию из useCrudForm)
      if (result && typeof result === 'object' && 'content' in result) {
        const data = result as CrudResponse

        await baseForm.updateModelFromResponse(data)

        // Извлекаем версию из ответа после успешного сохранения
        if (data.content?.version && typeof data.content.version === 'string') {
          version.value = data.content.version
        }
      }

      // Сбрасываем флаг принудительного сохранения
      forcedSave.value = false

      // Показываем уведомление об успехе
      notifications.positive(successMessage)

      return result
    }
    catch (error) {
      handleSubmitError(error as AxiosError<ValidationErrorResponse>)
    }
  }

  return {
    ...baseForm,
    load,
    submit,
    isCreateMode,
    currentUrl,
    version,
    forcedSave,
    isDataReady,
  }
}
