import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/workers',
    name: 'workersIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'workers_index',
      title: 'modules.workers.title',
      menuTitle: 'modules.workers.title',
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
      menuTitle: 'modules.workers.single',
      menuHide: true,
    },
  },
  {
    path: '/workers/:id',
    name: 'workerEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'workers_view',
      menuTitle: 'modules.workers.single',
      menuHide: true,
    },
  },
]
