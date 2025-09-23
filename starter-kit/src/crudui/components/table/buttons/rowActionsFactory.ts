import { useRouter } from 'vue-router'
import type { RouteParamValueRaw } from 'vue-router'
import type { CrudRowAction } from '@crudui/providers/useCrudDataList'
import type { FormModel } from '@crudui/types'
import { i18n } from '@crudui/boot/i18n'

export interface StandardActionConfig<T = unknown> {
  show?: (item: T) => boolean
  class?: string
}

export interface EditActionConfig<T = unknown> extends StandardActionConfig<T> {
  routeName: string
  paramName?: string
}

export interface EditDialogActionConfig<T = unknown> extends StandardActionConfig<T> {
  handler: (item: T) => void | Promise<void>
}

export interface DeleteActionConfig<T = unknown> extends StandardActionConfig<T> {
  onDelete: (item: T) => void | Promise<void>
}

export interface ViewActionConfig<T = unknown> extends StandardActionConfig<T> {
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
  config: EditActionConfig<T>,
): CrudRowAction<T> {
  const router = useRouter()

  return {
    name: 'edit',
    icon: 'tabler-edit',
    color: 'primary',
    class: config.class || 'text-blue-600',
    label: i18n.global.t('common.update'),
    show: config.show,
    handler: (item: T) => {
      const paramName = config.paramName || 'id'
      const paramValue = item[paramName]

      void router.push({
        name: config.routeName,
        params: { [paramName]: getRouteParam(paramValue) },
      })
    },
  }
}

export function createEditDialogAction<T extends FormModel>(
  config: EditDialogActionConfig<T>,
): CrudRowAction<T> {
  return {
    name: 'edit-dialog',
    icon: 'tabler-edit',
    color: 'primary',
    class: config.class || 'text-blue-600',
    label: i18n.global.t('common.update'),
    show: config.show,
    handler: config.handler,
  }
}

export function createDeleteAction<T extends FormModel>(
  config: DeleteActionConfig<T>,
): CrudRowAction<T> {
  return {
    name: 'delete',
    icon: 'tabler-trash',
    color: 'primary',
    class: config.class || 'text-red-600',
    label: i18n.global.t('common.delete'),
    show: config.show,
    handler: config.onDelete,
  }
}

export function createViewAction<T extends FormModel>(
  config: ViewActionConfig<T>,
): CrudRowAction<T> {
  const router = useRouter()

  return {
    name: 'view',
    icon: 'mdi-eye',
    color: 'grey-darken-1',
    class: config.class || 'text-grey-600',
    label: i18n.global.t('common.view'),
    show: config.show,
    handler: (item: T) => {
      const paramName = config.paramName || 'id'
      const paramValue = item[paramName]

      void router.push({
        name: config.routeName,
        params: { [paramName]: getRouteParam(paramValue) },
      })
    },
  }
}

// Композитная функция для создания стандартного набора действий
export function createStandardActions<T extends FormModel>(config: {
  edit?: EditActionConfig<T>
  editDialog?: EditDialogActionConfig<T>
  delete?: DeleteActionConfig<T>
  view?: ViewActionConfig<T>
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
