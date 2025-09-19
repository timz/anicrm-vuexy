import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/adv-sources',
    name: 'advSourcesIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'adv_sources_index',
      menuTitle: 'Источники рекламы',
      menuIcon: 'mdi-bullhorn',
      menuSort: 70,
    },
  },
  {
    path: '/adv-sources/create',
    name: 'advSourceCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'adv_sources_create',
      menuTitle: 'Источник рекламы',
      menuHide: true,
    },
  },
  {
    path: '/adv-sources/:id',
    name: 'advSourceEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'adv_sources_view',
      menuTitle: 'Источник рекламы',
      menuHide: true,
    },
  },
]
