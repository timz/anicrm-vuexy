import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { TCrudRouteRecord } from '@crud/interfaces/CrudRouterInterface'
import { useMeStore } from '@crud/stores/meStore'
import envService from '@crud/services/EnvService'
import { notifications } from '@crud/boot/notification'

/**
 * @description Обходим все папки модулей в @modules/* и объединяем все routes.ts
 */
const modulesRouteFiles = import.meta.glob('../../modules/*/routes.ts',{ eager: true })
const modulesRoute: unknown[] = []

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

Object.keys(modulesRouteFiles).forEach((key) => {
  // @ts-expect-error to_do
  const defaultModule = modulesRouteFiles[key].default
  if (!defaultModule) return
  const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
  modulesRoute.push(...moduleList)
})

/**
 * @description Все постоянные роуты объявляем здесь
 */
const routes: TCrudRouteRecord[] = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@crud/layouts/AuthLayoutDefault.vue'),
    redirect: '/auth/login',
    meta: {
      menuTitle: '',
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@modules/auth/LoginPage.vue'),
        meta: {
          layout: 'auth'
        },
      },
    ],
  },
  {
    path: '/',
    name: 'static',
    component: () => import('@crud/layouts/MainLayoutDefault.vue'),
    children: [
      {
        name: 'home',
        path: '/',
        redirect: { name: 'dashboardIndex' },
        meta: {
          permissions: ['minimum_perm'],
          menuTitle: 'Главная',
          menuSort: 10,
        },
      },
    ],
    meta: {
      title: '',
      menuTitle: '',
    },
  },
  {
    path: '/',
    name: 'root',
    component: () => import('@crud/layouts/CleanLayout.vue'),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    children: modulesRoute.flat(1), //Роуты всех модулей динамически подгружаем сюда, без иерархии
  },
  {
    path: '/',
    name: 'errors',
    component: () => import('@crud/layouts/ErrorsLayoutDefault.vue'),
    children: [
      {
        path: '/:catchAll(.*)*',
        component: () => import('@crud/pages/DefaultErrorPage.vue'),
        meta: {
          // title: 'Страница не найдена',
          description: 'Опаньки. Похоже тут ничего нет...',
        },
      },
      // {
      //   path: 'error-pay',
      //   name: 'errorPay',
      //   component: () => import('@modules/subscriptions/components/ErrorPayPage.vue')
      // },
      // {
      //   path: 'error-pay-form',
      //   name: 'errorPayOwner',
      //   component: () => import('@modules/subscriptions/components/ErrorPayOwnerPage.vue')
      // },
      {
        path: 'error',
        name: 'errorDefault',
        component: () => import('@crud/pages/DefaultErrorPage.vue'),
        meta: {
          description: 'Ошибка!',
        },
      },
      {
        path: 'error500',
        name: 'error500',
        component: () => import('@crud/pages/DefaultErrorPage.vue'),
        meta: {
          description: 'Попробуйте еще раз или обратитесь к администратору',
        },
      },
      {
        path: 'network-error',
        name: 'errorNetwork',
        component: () => import('@crud/pages/DefaultErrorPage.vue'),
        meta: {
          description: 'Сервер недоступен. Попробуйте открыть приложение чуть позже или обратитесь к администратору',
        },
      },
    ],
    meta: {
      // title: '',
      menuTitle: '',
    },
  },
]

export default function () {
  const createHistory = import.meta.env.SERVER
    ? createMemoryHistory
    : import.meta.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.MODE === 'ssr' ? void 0 : import.meta.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to, from, next) => {
    window.document.title = 'Приложение ' + (<string>to.meta.title ?? '')

    // Если данные о юзере не были ниразу подгружены, и это не страница логина, то подгружаем их
    const meStore = useMeStore()

    if (meStore.loaded == false && !freeRoutes.includes(<string>to.name)) {
      // Проверяем есть ли нормальный базовый url
      // если нет то logout и на страницу логина
      if (!envService.BaseUrlIsValid()) {
        await meStore.logout()
        return next({ name: 'login' })
      }
      const result = await meStore.loadMe(routes)
      // Если что-то не так пошло при подгрузке, то logout и на страницу логина
      if (!result) {
        await meStore.logout()
        return next({ name: 'login' })
      }
    }

    // Если юзер ломится в закрытую страницу, то перенаправляем на главную
    if (!meStore.userCanRoute(to)) {
      notifications.warning('У вас нет доступа к странице ' + to.fullPath)
      return next({ name: 'dashboardIndex' })
    }

    // Если аккаунт организации залочен из-за неуплаты, то уходим на страницу ошибки
    const paymentBlockExcludeRoutes = ['errorPay', 'logout','errorPayOwner']
    if(meStore.org_not_paid_block==true && !paymentBlockExcludeRoutes.includes(<string>to.name)) {
      if (meStore.userCan("subscription") == true) {
        return next({ name: 'errorPayOwner' })
      } else {
        return next({ name: 'errorPay' })
      }
    }

    // Если все ок, то переходим на следующую страницу
    next()
  })

  return Router
}