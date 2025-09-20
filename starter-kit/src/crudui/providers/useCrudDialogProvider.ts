import { ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { type CrudDataFormConfig, useCrudDataForm } from './useCrudDataForm'
import type { FormModel } from '@crudui/types'

export interface CrudDialogConfig<T extends FormModel = FormModel> {
  formConfig: CrudDataFormConfig<T>
  onItemSaved?: (item: T) => void | Promise<void>
  onDialogOpen?: (editId: string | number | null) => void | Promise<void>
  onDialogClose?: () => void | Promise<void>
}

export interface CrudDialogProviderReturn<T extends FormModel = FormModel> {
  readonly model: Ref<T>
  readonly isOpen: Ref<boolean>
  readonly editId: Ref<string | number | null>
  readonly isCreateMode: ComputedRef<boolean>
  readonly formConfig: CrudDataFormConfig<T>
  readonly wasSaved: Ref<boolean>
  readonly openCreateDialog: () => void
  readonly openEditDialog: (id: string | number) => void
  readonly closeDialog: () => void
  readonly handleItemSaved: (item: T) => void
}

export function useCrudDialogProvider<T extends FormModel = FormModel>(
  config: CrudDialogConfig<T>,
): CrudDialogProviderReturn<T> {
  const isOpen = ref(false)
  const editId = ref<string | number | null>(null)
  const wasSaved = ref(false)

  // Создаем dataForm для получения isCreateMode из единого источника
  const dataForm = useCrudDataForm<T>(config.formConfig)

  // Используем isCreateMode из dataForm как источник истины
  const isCreateMode = dataForm.isCreateMode

  const openCreateDialog = (): void => {
    editId.value = null
    wasSaved.value = false

    // Устанавливаем режим создания через модель (источник истины)
    const primaryKey = config.formConfig.primaryKey ?? 'id'

    config.formConfig.model.value[primaryKey as keyof T] = null

    isOpen.value = true
    void config.onDialogOpen?.(null)
  }

  const openEditDialog = (id: string | number): void => {
    editId.value = id
    wasSaved.value = false

    // Устанавливаем режим редактирования через модель (источник истины)
    const primaryKey = config.formConfig.primaryKey ?? 'id'

    config.formConfig.model.value[primaryKey as keyof T] = id as T[keyof T]

    isOpen.value = true
    void config.onDialogOpen?.(id)
  }

  const closeDialog = (): void => {
    isOpen.value = false
    if (wasSaved.value) {
      void config.onItemSaved?.(undefined as unknown as T)
    }
    void config.onDialogClose?.()
  }

  const handleItemSaved = (item: T): void => {
    wasSaved.value = true
    void config.onItemSaved?.(item)
    closeDialog()
  }

  return {
    model: config.formConfig.model,
    isOpen,
    editId,
    isCreateMode, // Берем из dataForm
    formConfig: config.formConfig,
    wasSaved,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleItemSaved,
  }
}
