import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/rejection-reasons',
    name: 'rejectionReasonsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'rejection_reasons_index',
      menuTitle: 'Причины отказов',
      menuIcon: 'mdi-cancel',
      menuSort: 80,
    },
  },
  {
    path: '/rejection-reasons/create',
    name: 'rejectionReasonCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'rejection_reasons_create',
      menuTitle: 'Причина отказа',
      menuHide: true,
    },
  },
  {
    path: '/rejection-reasons/:id',
    name: 'rejectionReasonEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'rejection_reasons_view',
      menuTitle: 'Причина отказа',
      menuHide: true,
    },
  },
]
