import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/billing/history',
    name: 'billingHistory',
    component: () => import('./components/HistoryPage.vue'),
    meta: {
      layout: 'boxed',
      menuTitle: 'modules.billing.history.title',
      menuIcon: 'mdi-history',
      menuSort: 100,
      menuHide: false,
    },
  },
]
