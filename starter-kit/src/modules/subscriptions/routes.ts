import type { TCrudRouteRecord } from '@crud/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/subscriptions',
    name: 'subscriptionsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'subscription',
      menuTitle: 'Подписки',
      menuIcon: 'mdi-credit-card',
      menuSort: 110,
    },
  },
]