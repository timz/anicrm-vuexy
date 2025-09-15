import { inject, computed, type ComputedRef } from 'vue'
import type { CrudEditPageReturn } from '@crudui/providers/useCrudEditPage'
import type { FormModel } from '@crudui/types'

export interface TabParentReturn<T extends FormModel = FormModel> {
  parentModel: ComputedRef<T | undefined>
  parentId: ComputedRef<string | number | null | undefined>
  isParentNew: ComputedRef<boolean>
  isParentProcessing: ComputedRef<boolean>
  isParentDataReady: ComputedRef<boolean>
  refreshParent: () => Promise<void>
  saveParent: () => Promise<void>
  editPageProvider: CrudEditPageReturn<T> | undefined
}

export function useTabParentProvider<T extends FormModel = FormModel>(
  providerKey = 'editPageProvider'
): TabParentReturn<T> {
  const editPageProvider = inject<CrudEditPageReturn<T>>(providerKey)

  if (!editPageProvider) {
    console.warn(`EditPageProvider with key "${providerKey}" not found in tab context`)
  }

  const parentModel = computed(() => editPageProvider?.model.value)
  const parentId = computed(() => parentModel.value?.id)
  const isParentNew = computed(() => editPageProvider?.isCreateMode.value ?? false)
  const isParentProcessing = computed(() => editPageProvider?.stateProcessing.value ?? false)
  const isParentDataReady = computed(() => editPageProvider?.isDataReady.value ?? false)

  const refreshParent = async (): Promise<void> => {
    if (editPageProvider?.load) {
      await editPageProvider.load()
    }
  }

  const saveParent = async (): Promise<void> => {
    if (editPageProvider?.handleSave) {
      await editPageProvider.handleSave()
    }
  }

  return {
    parentModel,
    parentId,
    isParentNew,
    isParentProcessing,
    isParentDataReady,
    refreshParent,
    saveParent,
    editPageProvider
  }
}