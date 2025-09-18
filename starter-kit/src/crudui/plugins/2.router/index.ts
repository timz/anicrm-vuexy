import { setupLayouts } from 'virtual:meta-layouts'
import type { App } from 'vue'

import type { RouteRecordRaw } from 'vue-router/auto'
import { createRouter, createWebHistory } from 'vue-router/auto'
import envService from '@crudui/services/EnvService'
import { canNavigate } from '@/crudui/plugins/casl'
import { useMeStore } from '@crudui/stores/meStore'
import { notifications } from '@crudui/boot/notification'
import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

// Список свободных роутов из spa-vuetify
export const freeRoutes = [
  'login',
  'logout',
  'register',
  'errorNetwork',
  'error500',
  'errors',
  'errorDefault',
  'errorPay',
  'errorPayOwner'
]

// Динамический импорт модульных роутов из @modules/*/routes.ts
const modulesRouteFiles = import.meta.glob('../../../modules/*/routes.ts', { eager: true })
const modulesRoute: TCrudRouteRecord[] = []

Object.keys(modulesRouteFiles).forEach((key) => {
  // @ts-expect-error to_do
  const defaultModule = modulesRouteFiles[key].default
  if (!defaultModule) return
  const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
  modulesRoute.push(...moduleList)
})

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

// Подготавливаем все роуты
const allRoutes = [
  // Базовые системные роуты
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboardIndex' },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/LoginPage.vue'),
    meta: {
      layout: 'auth',
      public: true
    }
  },
  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('@/crudui/pages/DefaultErrorPage.vue'),
    meta: {
      layout: 'error',
      public: true,
      description: 'У вас нет доступа к этой странице'
    }
  },
  // Модульные роуты
  ...modulesRoute.map(route => {
    // Устанавливаем layout через meta для совместимости с virtual:meta-layouts
    if (route.meta && !route.meta.layout) {
      route.meta.layout = 'default'
    }
    return route as RouteRecordRaw
  }),
  // Catch-all должен быть последним
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/crudui/pages/DefaultErrorPage.vue'),
    meta: {
      layout: 'error',
      public: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }

    return { top: 0 }
  },
  extendRoutes: pages => {
    // Применяем setupLayouts ко всем роутам
    const routesWithLayouts = setupLayouts(allRoutes as RouteRecordRaw[])
    // Объединяем с автогенерированными страницами (если они есть)
    return [
      ...[...pages].map(route => recursiveLayouts(route)),
      ...routesWithLayouts
    ]
  },
})

// Защита маршрутов - проверка авторизации и CASL прав
router.beforeEach(async (to, from, next) => {
  // Установка заголовка страницы
  window.document.title = 'Приложение ' + (to.meta.title ?? '')

  const meStore = useMeStore()
  const isAuthenticated = !!envService.getAuthToken()
  const isFreeRoute = freeRoutes.includes(to.name as string)

  // Если данные о юзере не были загружены, и это не свободный роут, то загружаем их
  if (isAuthenticated && !meStore.loaded && !isFreeRoute) {
    // Проверяем есть ли нормальный базовый URL
    if (!envService.BaseUrlIsValid()) {
      await meStore.logout()
      return next({ name: 'login' })
    }

    // Загружаем данные пользователя
    const result = await meStore.loadMe(router.getRoutes() as unknown as TCrudRouteRecord[])

    // Если что-то пошло не так при загрузке, то logout и на страницу логина
    if (!result) {
      await meStore.logout()
      return next({ name: 'login' })
    }
  }

  // Проверка для неавторизованных пользователей
  if (!isAuthenticated && !isFreeRoute) {
    return next('/login')
  }

  // Если авторизован и пытается зайти на login
  if (isAuthenticated && to.path === '/login') {
    return next('/')
  }

  // Проверка оплаты подписки организации (из spa-vuetify)
  const paymentBlockExcludeRoutes = ['errorPay', 'logout', 'errorPayOwner']
  if (meStore.org_not_paid_block === true && !paymentBlockExcludeRoutes.includes(to.name as string)) {
    if (meStore.userCan('subscription')) {
      return next({ name: 'errorPayOwner' })
    } else {
      return next({ name: 'errorPay' })
    }
  }

  // Проверка CASL прав для авторизованных пользователей
  if (isAuthenticated && !isFreeRoute) {
    // Проверка через CASL если есть action и subject в meta
    if (to.meta.action && to.meta.subject) {
      if (!canNavigate(to)) {
        notifications.warning('У вас нет доступа к странице ' + to.fullPath)
        return next({ name: 'dashboardIndex' })
      }
    }
    // Проверка через старый механизм permissions (для обратной совместимости)
    else if (to.meta.permission && !meStore.userCan(to.meta.permission as string)) {
      notifications.warning('У вас нет доступа к странице ' + to.fullPath)
      return next({ name: 'dashboardIndex' })
    }
  }

  next()
})

export { router }

export default function (app: App) {
  app.use(router)
}
