import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/deals',
    name: 'dealsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'deals_index',
      menuTitle: 'Сделки',
      menuIcon: 'mdi-handshake',
      menuSort: 10,
    },
  },
  {
    path: '/deals/create',
    name: 'dealCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'deals_create',
      menuTitle: 'Сделка',
      menuHide: true,
    },
  },
  {
    path: '/deals/:id',
    name: 'dealEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'deals_view',
      menuTitle: 'Сделка',
      menuHide: true,
    },
  },
]
