import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/clients',
    name: 'clientsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'clients_index',
      title: 'Клиенты',
      menuTitle: 'Клиенты',
      menuIcon: 'mdi-account',
      menuSort: 5,
    },
  },
  {
    path: '/clients/create',
    name: 'clientCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'clients_create',
      menuTitle: 'Клиент',
      menuHide: true,
    },
  },
  {
    path: '/clients/:id',
    name: 'clientEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'clients_view',
      menuTitle: 'Клиент',
      menuHide: true,
    },
  },
]