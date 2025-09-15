import type { CrudRowAction } from '@crud/providers/useCrudDataList'
import { useRouter } from 'vue-router'
import type { RouteParamValueRaw } from 'vue-router'
import type { FormModel } from '@crud/types'

export interface StandardActionConfig {
  show?: (item: unknown) => boolean
  class?: string
}

export interface EditActionConfig extends StandardActionConfig {
  routeName: string
  paramName?: string
}

export interface EditDialogActionConfig extends StandardActionConfig {
  handler: (item: unknown) => void | Promise<void>
}

export interface DeleteActionConfig extends StandardActionConfig {
  onDelete: (item: unknown) => void | Promise<void>
}

export interface ViewActionConfig extends StandardActionConfig {
  routeName: string
  paramName?: string
}

function getRouteParam(value: unknown): RouteParamValueRaw {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }
  // Для остальных типов возвращаем пустую строку
  return ''
}

export function createEditAction<T extends FormModel>(
  config: EditActionConfig
): CrudRowAction<T> {
  const router = useRouter()

  return {
    name: 'edit',
    icon: 'mdi-pencil',
    color: 'primary',
    class: config.class || 'text-blue-600',
    label: 'Изменить',
    show: config.show,
    handler: (item: T) => {
      const paramName = config.paramName || 'id'
      const paramValue = item[paramName]
      void router.push({
        name: config.routeName,
        params: { [paramName]: getRouteParam(paramValue) }
      })
    }
  }
}

export function createEditDialogAction<T extends FormModel>(
  config: EditDialogActionConfig
): CrudRowAction<T> {
  return {
    name: 'edit-dialog',
    icon: 'mdi-pencil',
    color: 'primary',
    class: config.class || 'text-blue-600',
    label: 'Изменить',
    show: config.show,
    handler: config.handler
  }
}

export function createDeleteAction<T extends FormModel>(
  config: DeleteActionConfig
): CrudRowAction<T> {
  return {
    name: 'delete',
    icon: 'mdi-delete',
    color: 'error',
    class: config.class || 'text-red-600',
    label: 'Удалить',
    show: config.show,
    handler: config.onDelete
  }
}

export function createViewAction<T extends FormModel>(
  config: ViewActionConfig
): CrudRowAction<T> {
  const router = useRouter()

  return {
    name: 'view',
    icon: 'mdi-eye',
    color: 'grey-darken-1',
    class: config.class || 'text-grey-600',
    label: 'Просмотр',
    show: config.show,
    handler: (item: T) => {
      const paramName = config.paramName || 'id'
      const paramValue = item[paramName]
      void router.push({
        name: config.routeName,
        params: { [paramName]: getRouteParam(paramValue) }
      })
    }
  }
}

// Композитная функция для создания стандартного набора действий
export function createStandardActions<T extends FormModel>(config: {
  edit?: EditActionConfig
  editDialog?: EditDialogActionConfig
  delete?: DeleteActionConfig
  view?: ViewActionConfig
}): CrudRowAction<T>[] {
  const actions: CrudRowAction<T>[] = []

  if (config.view) {
    actions.push(createViewAction(config.view))
  }

  if (config.edit) {
    actions.push(createEditAction(config.edit))
  }

  if (config.editDialog) {
    actions.push(createEditDialogAction(config.editDialog))
  }

  if (config.delete) {
    actions.push(createDeleteAction(config.delete))
  }

  return actions
}