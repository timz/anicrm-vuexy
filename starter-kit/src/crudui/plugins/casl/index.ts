import type { App } from 'vue'
import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin, useAbility } from '@casl/vue'
import type { RouteLocationNormalized } from 'vue-router'
import type { Rule } from './ability'
import { ability } from './ability'
import type { NavGroup } from '@crudui/components/templates/helpers/types'

export default function (app: App) {
  // Получаем правила из localStorage (вместо cookie для совместимости с нашей системой)
  const storedRules = localStorage.getItem('userAbilityRules')
  const userAbilityRules: Rule[] = storedRules ? JSON.parse(storedRules) : []

  const initialAbility = createMongoAbility(userAbilityRules)

  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}

// Конвертация старых permissions в CASL rules
export function convertPermissionsToCaslRules(permissions: Record<string, any>): Rule[] {
  const rules: Rule[] = []

  // Если есть полные права администратора
  if (permissions['admin'] || permissions['administrator']) {
    rules.push({ action: 'manage', subject: 'all' })
    return rules
  }

  // Маппинг известных permissions в CASL правила
  const permissionMapping: Record<string, { action: string; subject: string }> = {
    'users': { action: 'manage', subject: 'User' },
    'clients': { action: 'manage', subject: 'Client' },
    'deals': { action: 'manage', subject: 'Deal' },
    'products': { action: 'manage', subject: 'Product' },
    'dashboard': { action: 'view', subject: 'Dashboard' },
    'settings': { action: 'manage', subject: 'Settings' },
    'subscription': { action: 'manage', subject: 'Subscription' },
    'organization': { action: 'manage', subject: 'Organization' },

    // Добавляем специфичные права
    'users_read': { action: 'read', subject: 'User' },
    'users_create': { action: 'create', subject: 'User' },
    'users_update': { action: 'update', subject: 'User' },
    'users_delete': { action: 'delete', subject: 'User' },

    'clients_read': { action: 'read', subject: 'Client' },
    'clients_create': { action: 'create', subject: 'Client' },
    'clients_update': { action: 'update', subject: 'Client' },
    'clients_delete': { action: 'delete', subject: 'Client' },

    'deals_read': { action: 'read', subject: 'Deal' },
    'deals_create': { action: 'create', subject: 'Deal' },
    'deals_update': { action: 'update', subject: 'Deal' },
    'deals_delete': { action: 'delete', subject: 'Deal' },
  }

  // Конвертируем каждое permission в CASL rule
  Object.keys(permissions).forEach(permission => {
    if (permissionMapping[permission]) {
      rules.push(permissionMapping[permission])
    } else {
      // Для неизвестных permissions создаем общее правило
      // Используем permission как subject для обратной совместимости
      rules.push({ action: 'access', subject: permission })
    }
  })

  // Добавляем базовое правило для доступа к роутам
  if (rules.length > 0) {
    rules.push({ action: 'access', subject: 'Route' })
  }

  return rules
}

// Вспомогательная функция для сохранения правил после авторизации
export function saveAbilityRules(rules: Rule[]) {
  localStorage.setItem('userAbilityRules', JSON.stringify(rules))
  // Обновляем глобальный ability
  ability.update(rules)
}

// Функция для очистки правил при выходе
export function clearAbilityRules() {
  localStorage.removeItem('userAbilityRules')
  // Очищаем глобальный ability
  ability.update([])
}

/**
 * Returns ability result if ACL is configured or else just return true
 * We should allow passing string | undefined to can because for admin ability we omit defining action & subject
 *
 * Useful if you don't know if ACL is configured or not
 * Used in crudui files to handle absence of ACL without errors
 *
 * @param {string} action CASL Actions // https://casl.js.org/v4/en/guide/intro#basics
 * @param {string} subject CASL Subject // https://casl.js.org/v4/en/guide/intro#basics
 */
export const can = (action: string | undefined, subject: string | undefined) => {
  const vm = getCurrentInstance()

  if (!vm)
    return false

  const localCan = vm.proxy && '$can' in vm.proxy

  // @ts-expect-error We will get TS error in below line because we aren't using $can in component instance
  return localCan ? vm.proxy?.$can(action, subject) : true
}

/**
 * Check if user can view item based on it's ability
 * Based on item's action and subject & Hide group if all of it's children are hidden
 * @param {object} item navigation object item
 */
export const canViewNavMenuGroup = (item: NavGroup) => {
  const hasAnyVisibleChild = item.children.some(i => can(i.action, i.subject))

  // If subject and action is defined in item => Return based on children visibility (Hide group if no child is visible)
  // Else check for ability using provided subject and action along with checking if has any visible child
  if (!(item.action && item.subject))
    return hasAnyVisibleChild

  return can(item.action, item.subject) && hasAnyVisibleChild
}

export const canNavigate = (to: RouteLocationNormalized) => {
  const ability = useAbility()

  // Get the most specific route (last one in the matched array)
  const targetRoute = to.matched[to.matched.length - 1]

  // If the target route has specific permissions, check those first
  if (targetRoute?.meta?.action && targetRoute?.meta?.subject)
    return ability.can(targetRoute.meta.action, targetRoute.meta.subject)

  // If no specific permissions, fall back to checking if any parent route allows access
  // @ts-expect-error We should allow passing string | undefined to can because for admin ability we omit defining action & subject
  return to.matched.some(route => ability.can(route.meta.action, route.meta.subject))
}
