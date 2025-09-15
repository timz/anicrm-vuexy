import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/workers',
    name: 'workersIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'workers_index',
      title: 'Сотрудники',
      menuTitle: 'Сотрудники',
      menuIcon: 'mdi-account-group',
      menuSort: 30,
    },
  },
  {
    path: '/workers/create',
    name: 'workerCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'workers_create',
      menuTitle: 'Сотрудник',
      menuHide: true,
    },
  },
  {
    path: '/workers/:id',
    name: 'workerEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'workers_view',
      menuTitle: 'Сотрудник',
      menuHide: true,
    },
  },
]