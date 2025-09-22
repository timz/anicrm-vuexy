import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/rejection-reasons',
    name: 'rejectionReasonsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'rejection_reasons_index',
      menuTitle: 'modules.rejectionReasons.title',
      menuIcon: 'mdi-cancel',
      menuSort: 80,
      menuHide: true,
    },
  },
  {
    path: '/rejection-reasons/create',
    name: 'rejectionReasonCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'rejection_reasons_create',
      menuTitle: 'modules.rejectionReasons.single',
      menuHide: true,
    },
  },
  {
    path: '/rejection-reasons/:id',
    name: 'rejectionReasonEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'rejection_reasons_view',
      menuTitle: 'modules.rejectionReasons.single',
      menuHide: true,
    },
  },
]
