import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/clients',
    name: 'clientsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'clients_index',
      title: 'modules.clients.title',
      menuTitle: 'modules.clients.title',
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
      menuTitle: 'modules.clients.single',
      menuHide: true,
    },
  },
  {
    path: '/clients/:id',
    name: 'clientEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'clients_view',
      menuTitle: 'modules.clients.single',
      menuHide: true,
    },
  },
]
