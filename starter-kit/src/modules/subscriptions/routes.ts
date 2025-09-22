import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/subscriptions',
    name: 'subscriptionsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'subscription',
      menuTitle: 'modules.subscriptions.title',
      menuIcon: 'mdi-credit-card',
      menuSort: 110,
    },
  },
]
