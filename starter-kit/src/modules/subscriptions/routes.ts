import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/subscriptions',
    name: 'subscriptionsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      menuTitle: 'modules.subscriptions.title',
      menuIcon: 'mdi-credit-card',
      menuSort: 110,
    },
  },
  {
    path: '/subscriptions/confirm',
    name: 'subscriptionsConfirm',
    component: () => import('./components/SubscriptionConfirm.vue'),
    meta: {
      layout: 'default',
      menuTitle: 'subscriptionsConfirm',
    },
  },
]
