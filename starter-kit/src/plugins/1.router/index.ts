import { setupLayouts } from 'virtual:meta-layouts'
import type { App } from 'vue'

import type { RouteRecordRaw } from 'vue-router/auto'

import { createRouter, createWebHistory } from 'vue-router/auto'
import envService from '@/services/EnvService'

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

// Защита маршрутов - проверка авторизации
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!envService.getAuthToken()
  const isPublicRoute = to.meta.public === true || to.path === '/login'
  
  if (!isAuthenticated && !isPublicRoute) {
    // Если пользователь не авторизован и пытается зайти на защищенную страницу
    next('/login')
  } else if (isAuthenticated && to.path === '/login') {
    // Если пользователь авторизован и пытается зайти на страницу логина
    next('/')
  } else {
    next()
  }
})

export { router }

export default function (app: App) {
  app.use(router)
}
