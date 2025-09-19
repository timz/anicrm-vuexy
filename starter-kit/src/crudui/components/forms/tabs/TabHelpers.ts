import type { AsyncComponentLoader, Component } from 'vue'
import type { CrudTabInterface, TabContext } from './TabTypes'

// Создать тип специально для асинхронных компонентов табов
export type CrudTabComponent =
  | Component // Обычный Vue компонент
  | AsyncComponentLoader // Асинхронный загрузчик
  | (() => Promise<Component>) // Функция возвращающая Promise компонента
  | (() => Promise<{ default: Component }>) // ES module import

// Стандартные функции видимости для вкладок
export const TabVisibilityHelpers = {
  // Показывать только при редактировании (не при создании)
  hideOnNew: (context: TabContext): boolean => !context.isNew,

  // Показывать только при создании
  showOnlyNew: (context: TabContext): boolean => context.isNew,

  // Показывать только если есть parentId
  requiresParentId: (context: TabContext): boolean => Boolean(context.parentId),

  // Комбинированное условие: не новая запись и есть parentId
  editModeWithParent: (context: TabContext): boolean =>
    !context.isNew && Boolean(context.parentId),

  // Проверка наличия определенного параметра в route
  requiresRouteParam: (paramName: string) => (context: TabContext): boolean =>
    Boolean(context.routeParams?.[paramName]),

  // Проверка наличия определенного поля в formData
  requiresFormField: (fieldName: string) => (context: TabContext): boolean =>
    Boolean(context.formData?.[fieldName]),
}

// Хелперы для создания стандартных конфигураций вкладок
export const TabConfigHelpers = {
  // Создание вкладки для связанных сущностей
  createRelatedEntityTab(
    name: string,
    label: string,
    component: CrudTabComponent,
    options: {
      hideOnNew?: boolean
      permissions?: string[]
      meta?: Record<string, unknown>
    } = {},
  ): CrudTabInterface {
    return {
      name,
      label,
      tab: component,
      visible: options.hideOnNew ? TabVisibilityHelpers.hideOnNew : undefined,
      permissions: options.permissions,
      meta: options.meta,
      lazy: true,
    }
  },

  // Создание вкладки с проверкой прав доступа
  createPermissionBasedTab(
    name: string,
    label: string,
    component: CrudTabComponent,
    permissions: string[],
    meta?: Record<string, unknown>,
  ): CrudTabInterface {
    return {
      name,
      label,
      tab: component,
      permissions,
      meta,
      lazy: true,
    }
  },

  // Создание условной вкладки
  createConditionalTab(
    name: string,
    label: string,
    component: CrudTabComponent,
    visibilityFn: (context: TabContext) => boolean,
    meta?: Record<string, unknown>,
  ): CrudTabInterface {
    return {
      name,
      label,
      tab: component,
      visible: visibilityFn,
      meta,
      lazy: true,
    }
  },
}

// Валидация конфигурации вкладок
export function validateTabsConfig(tabs: CrudTabInterface[]): string[] {
  const errors: string[] = []
  const names = new Set<string>()

  tabs.forEach((tab, index) => {
    // Проверка уникальности имен
    if (names.has(tab.name)) {
      errors.push(`Duplicate tab name "${tab.name}" at index ${index}`)
    }
    names.add(tab.name)

    // Проверка обязательных полей
    if (!tab.name.trim()) {
      errors.push(`Tab at index ${index} has empty name`)
    }
    if (!tab.label.trim()) {
      errors.push(`Tab at index ${index} has empty label`)
    }
    if (!tab.tab) {
      errors.push(`Tab "${tab.name}" has no component`)
    }
  })

  return errors
}
