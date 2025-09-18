import { defineStore } from 'pinia'
import { sortBy } from 'lodash'
import { toRaw } from 'vue'
import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'
import { freeRoutes } from '@crudui/plugins/2.router'
import type { NotifyItemDto } from '@crudui/interfaces/NotifyItemDto'
import { secureApi } from '@crudui/services/AxiosService'
import envService from '@crudui/services/EnvService'
import type { RouteLocationNormalized } from 'vue-router'
import type { MenuItemInterface } from '@crudui/components/templates/menus/left/MenuItemInterface'
import { menuGroups, type MenuGroupKey } from '@crudui/configs/menuGroups'
import { ability } from '@crudui/plugins/casl/ability'
import { convertPermissionsToCaslRules, saveAbilityRules, clearAbilityRules } from '@crudui/plugins/casl/index'
import { useAbility } from '@casl/vue'

// Локальные типы для разрешений
type PermissionsType = Record<string, 'all'>

// Константы для меню
const DEFAULT_ICON = 'apps' as const
const GROUP_PLACEHOLDER_PATH = '#' as const
const MIN_PERMISSION = 'min_permission' as const
const DEFAULT_MENU_TITLE = 'Заголовок страницы' as const

export const useMeStore = defineStore('meStore', {
  state: () => ({
    loaded: false,
    user_id: 0,
    username: 'Гость',
    role_title: '',
    subscription_title: '',
    subscription_to: '',
    balance: 0.0,
    org_not_paid_block: false,
    timezone: '',

    permissions: <PermissionsType>{},
    leftMenu: [] as MenuItemInterface[],
    notifications: [] as NotifyItemDto[],

    // Кэш для проверки прав
    permissionCache: new Map<string, boolean>(),

    // Кэш для мемоизации меню
    menuCache: new Map<string, MenuItemInterface[]>(),
    lastMenuCacheKey: '' as string,
  }),
  getters: {
    // Создание ключа для кэширования меню
    menuCacheKey: (state) => {
      const permissionsHash = JSON.stringify(state.permissions)
      return `menu-${permissionsHash}`
    }
  },
  actions: {
    // Проверка может ли юзер ходить по роуту (через CASL)
    userCanRoute(route: RouteLocationNormalized): boolean {
      if (freeRoutes.includes(<string>route.name)) {
        return true
      }

      // Проверяем через CASL если есть action и subject в meta
      if (route.meta.action && route.meta.subject) {
        return ability.can(route.meta.action as string, route.meta.subject as string)
      }

      // Для обратной совместимости проверяем старый формат permission
      const routePerm = <string>route.meta.permission ?? ''
      if (routePerm === MIN_PERMISSION) {
        return true
      }

      return this.userCan(routePerm)
    },

    // Простая проверка может ли юзер выполнять действие (через CASL для новой логики)
    userCan(checkPermission: string): boolean {
      // min_permission всегда доступно для авторизованных пользователей
      if (!checkPermission || checkPermission === '' || checkPermission === MIN_PERMISSION) {
        return true
      }

      // Проверяем кэш
      if (this.permissionCache.has(checkPermission)) {
        return this.permissionCache.get(checkPermission)!
      }

      // Сначала проверяем через CASL для известных субъектов
      // Используем permission как subject для обратной совместимости
      let hasPermission = ability.can('access', checkPermission)

      // Если CASL не дал доступ, проверяем старую логику для обратной совместимости
      if (!hasPermission) {
        const userPerms = toRaw(this.permissions)
        hasPermission = !!(userPerms && userPerms[checkPermission])
      }

      // Сохраняем в кэш
      this.permissionCache.set(checkPermission, hasPermission)

      return hasPermission
    },

    // Валидация конфигурации группы
    validateGroupConfig(groupName: string): groupName is MenuGroupKey {
      return groupName in menuGroups
    },

    // Извлечение элементов меню из роутов
    extractMenuItems(routes: TCrudRouteRecord[]): MenuItemInterface[] {
      const rootRoute = routes.find((route) => route.name === 'root')
      if (!rootRoute) {
        console.warn('Корневой роут не обнаружен')
        return []
      }

      return rootRoute.children
        .filter((row) => row.meta && !row.meta.menuHide)
        .map((row) => <MenuItemInterface>{
          name: row.name,
          path: row.path,
          title: row.meta?.menuTitle || DEFAULT_MENU_TITLE,
          icon: row.meta?.menuIcon || DEFAULT_ICON,
          menuSort: row.meta?.menuSort || 0,
          menuParenName: row.meta?.menuParenName,
          permission: row.meta?.permission || '',
        })
    },

    // Обработка элементов меню в один проход
    processMenuItems(allMenus: MenuItemInterface[]): {
      direct: MenuItemInterface[],
      grouped: Record<string, MenuItemInterface[]>
    } {
      const direct: MenuItemInterface[] = []
      const grouped: Record<string, MenuItemInterface[]> = {}

      for (const item of allMenus) {
        if (!this.userCan(item.permission)) {
          continue
        }

        if (!item.menuParenName) {
          direct.push(item)
        } else {
          const parentName = item.menuParenName
          if (!grouped[parentName]) {
            grouped[parentName] = []
          }
          grouped[parentName].push(item)
        }
      }

      return { direct, grouped }
    },

    // Создание групп меню
    createMenuGroups(childrenMap: Record<string, MenuItemInterface[]>): MenuItemInterface[] {
      const groups: MenuItemInterface[] = []

      Object.entries(childrenMap).forEach(([parentName, children]) => {
        if (!this.validateGroupConfig(parentName)) {
          console.warn(`Конфигурация группы "${parentName}" не найдена`)
          return
        }

        const groupConfig = menuGroups[parentName]

        if (children.length > 0) {
          groups.push({
            name: groupConfig.name,
            title: groupConfig.title,
            path: GROUP_PLACEHOLDER_PATH,
            icon: groupConfig.icon,
            menuSort: groupConfig.menuSort,
            permission: '',
            childItems: sortBy(children, ['menuSort', 'title'])
          })
        }
      })

      return groups
    },

    // Собираем меню юзера с мемоизацией
    setMenu(routes: TCrudRouteRecord[]): MenuItemInterface[] {
      // Создаем ключ для кэша на основе permissions
      const cacheKey = this.menuCacheKey

      // Проверяем есть ли результат в кэше
      if (this.lastMenuCacheKey === cacheKey && this.menuCache.has(cacheKey)) {
        const cachedMenu = this.menuCache.get(cacheKey)!
        this.leftMenu = cachedMenu
        return cachedMenu
      }

      // Очищаем старый кэш если ключ изменился
      if (this.lastMenuCacheKey !== cacheKey) {
        this.permissionCache.clear()
        this.menuCache.clear()
      }

      // Вычисляем меню
      const allMenus = this.extractMenuItems(routes)
      const { direct, grouped } = this.processMenuItems(allMenus)
      const groups = this.createMenuGroups(grouped)
      const treeMenu = [...direct, ...groups]
      const result = sortBy(treeMenu, ['menuSort', 'title'])

      // Сохраняем в кэш
      this.menuCache.set(cacheKey, result)
      this.lastMenuCacheKey = cacheKey
      this.leftMenu = result

      return result
    },

    // Очистка кэша прав
    clearPermissionCache(): void {
      this.permissionCache.clear()
      this.menuCache.clear()
      this.lastMenuCacheKey = ''
    },

    // Подгружаем юзера
    async loadMe(routes: TCrudRouteRecord[]): Promise<boolean> {
      try {
        this.clearPermissionCache()

        const response = await secureApi.post('/auth/me', {app: 'app'})
        const responseData = response.data
        this.username = responseData.content.username
        this.user_id = responseData.content.user_id
        this.role_title = responseData.content.role || ''
        this.subscription_title = responseData.content.subscription_title || ''
        this.subscription_to = responseData.content.subscription_to || ''
        this.balance = responseData.content.balance || 0
        this.org_not_paid_block = responseData.content.org_not_paid_block || false
        this.timezone = responseData.content.timezone || ''

        this.permissions = responseData.content.permissions || {}
        this.notifications = responseData.content.notifications || []


        // Конвертируем permissions в CASL rules и сохраняем
        if (responseData.content.casl_rules) {
          // Если сервер уже отдает CASL rules, используем их
          saveAbilityRules(responseData.content.casl_rules)
        } else if (this.permissions) {
          // Иначе конвертируем старые permissions в CASL rules
          const caslRules = convertPermissionsToCaslRules(this.permissions)
          saveAbilityRules(caslRules)
        }

        this.leftMenu = this.setMenu(routes)

        this.loaded = true
        return true
      } catch (e) {
        console.warn('loadMe error', e)
        return false
      }
    },

    // Выход
    async logout() {
      await secureApi.post('/auth/logout')
      this.username = ''
      this.role_title = ''
      this.subscription_title = ''
      this.subscription_to = ''
      this.balance = 0.0
      this.org_not_paid_block = false
      this.timezone = ''
      this.permissions = {}
      this.notifications = []
      this.leftMenu = []
      this.loaded = false

      this.clearPermissionCache()

      // Очищаем CASL правила
      clearAbilityRules()

      envService.removeTokenFromLocalStorage()
      envService.removeRefreshTokenFromLocalStorage()
      window.location.href = '/#/auth/login'
    },
  },
})