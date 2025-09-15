import { setupLayouts } from 'virtual:meta-layouts'
import type { App } from 'vue'

import type { RouteRecordRaw } from 'vue-router/auto'
import { createRouter, createWebHistory } from 'vue-router/auto'
import envService from '@crud/services/EnvService'
import { canNavigate } from '@/crudui/plugins/casl'

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }

    return { top: 0 }
  },
  extendRoutes: pages => [
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

// Защита маршрутов - проверка авторизации и CASL прав
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!envService.getAuthToken()
  const isPublicRoute = to.meta.public === true || to.path === '/login'

  if (!isAuthenticated && !isPublicRoute) {
    // Если пользователь не авторизован и пытается зайти на защищенную страницу
    next('/login')
  }
  else if (isAuthenticated && to.path === '/login') {
    // Если пользователь авторизован и пытается зайти на страницу логина
    next('/')
  }
  else if (isAuthenticated) {
    // Проверяем CASL права для авторизованных пользователей
    // Если у маршрута есть требования к правам доступа
    if (to.meta.action && to.meta.subject) {
      if (!canNavigate(to)) {
        // Если нет прав доступа, перенаправляем на страницу 403
        next({ name: 'not-authorized' })

        return
      }
    }
    next()
  }
  else {
    next()
  }
})

export { router }

export default function (app: App) {
  app.use(router)
}
