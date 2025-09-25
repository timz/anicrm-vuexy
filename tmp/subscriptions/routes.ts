import type { TCrudRouteRecord } from '@crud/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/select-subscription',
    name: 'selectSubscriptionPage',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'min_permission',
      menuTitle: 'Выбор подписки',
      menuIcon: 'money',
      menuSort: 100
    },
  },
  {
    path: '/subscription-success',
    name: 'SubscriptionSuccessPage',
    component: () => import('./components/SubscriptionSuccessPage.vue'),
    meta: {
      permission: 'min_permission',
      menuTitle: 'Успешная подписка',
      menuIcon: 'money',
      menuSort: 100
    },
  },
]
