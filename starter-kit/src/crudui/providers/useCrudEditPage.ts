import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type CrudDataFormConfig, type CrudDataFormReturn, useCrudDataForm } from './useCrudDataForm'
import type { FormModel, RouteConfig } from '@crudui/types'

// Конечный интерфейс через пересечение
export type CrudEditPageConfig<T extends FormModel = FormModel> = CrudDataFormConfig<T> & RouteConfig

export interface CrudEditPageReturn<T extends FormModel = FormModel> extends CrudDataFormReturn<T> {
  readonly handleSave: () => Promise<void>
  readonly handleCancel: () => void
}

export function useCrudEditPage<T extends FormModel = FormModel>(
  config: CrudEditPageConfig<T>
): CrudEditPageReturn<T> {
  const route = useRoute()
  const router = useRouter()

  // Параметры конфигурации
  const routeIdParam = config.routeIdParam ?? 'id'
  const primaryKey = config.primaryKey ?? 'id'

  // Получаем ID из роута
  const routeId = route.params[routeIdParam] as string | undefined

  // Устанавливаем ID в модель если это режим редактирования
  if (routeId && config.model.value[primaryKey as keyof T] === null) {
    // Используем Object.assign для безопасной записи в generic тип
    Object.assign(config.model.value, { [primaryKey]: Number(routeId) })
  }

  // Создаем форму - она будет источником истины для режимов
  const crudForm = useCrudDataForm<T>(config)

  // Загружаем данные при редактировании
  onMounted(async () => {
    if (crudForm.isCreateMode.value) {
      // Режим создания - очищаем модель
      config.model.value = {} as any
    } else {
      // Режим редактирования - загружаем данные
      try {
        await crudForm.load()
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    }
  })

  // Обработчик сохранения
  const handleSave = async (): Promise<void> => {
    // Сначала явно проверяем валидацию формы
    const isValid = await crudForm.validate()
    if (!isValid) {
      // Если валидация не прошла, прерываем выполнение
      // Ошибки валидации уже отображены в полях формы
      return
    }

    try {
      // Определяем режим: если данные не загружены с сервера И нет ID - это создание
      const wasCreateMode = !crudForm.isLoaded.value && crudForm.isCreateMode.value

      await crudForm.submit()

      // После создания записи переключаем на режим редактирования
      if (wasCreateMode && config.model.value[primaryKey as keyof T]) {
        const currentPath = route.path
        const basePath = currentPath.replace(/\/create$/, '')
        const primaryKeyValue = config.model.value[primaryKey as keyof T]
        const editPath = `${basePath}/${primaryKeyValue as string | number}`

        await router.replace(editPath)
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  // Обработчик отмены
  const handleCancel = (): void => {
    if (config.backRoute) {
      void router.push(config.backRoute)
    } else {
      router.back()
    }
  }

  return {
    ...crudForm,
    handleSave,
    handleCancel
  }
}