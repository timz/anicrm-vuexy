import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/history',
    name: 'billingHistory',
    component: () => import('./components/HistoryPage.vue'),
    meta: {
      menuTitle: 'modules.billing.history.title',
      menuIcon: 'mdi-history',
      menuSort: 100,
      menuHide: false,
    },
  },
  {
    path: '/blocked-history',
    name: 'blockedBillingHistory',
    component: () => import('./components/HistoryPage.vue'),
    meta: {
      layout: 'boxed',
      menuTitle: 'blocked Billing History',
      menuIcon: 'mdi-history',
      menuSort: 100,
      menuHide: false,
    },
  },

  {
    path: '/blocked',
    name: 'PayBlockedPage',
    component: () => import('./components/PayBlockedPage.vue'),
    meta: {
      layout: 'boxed',
      menuTitle: 'Pay Blocked Page',
      menuSort: 110,
    },
  },
  {
    path: '/subscriptions/confirm',
    name: 'subscriptionsConfirm',
    component: () => import('./components/SubscriptionConfirm.vue'),
    meta: {
      layout: 'clean',
      menuTitle: 'subscriptionsConfirm',
    },
  },
  {
    path: '/subscriptions/payment-summary',
    name: 'PaymentSummaryPage',
    component: () => import('./components/PaymentSummaryPage.vue'),
    meta: {
      layout: 'boxed',
      menuTitle: 'Payment Summary Page',
      menuHide: false,
    },
  },
]
