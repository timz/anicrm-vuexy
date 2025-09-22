import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/adv-sources',
    name: 'advSourcesIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'adv_sources_index',
      menuTitle: 'modules.advSources.title',
      menuIcon: 'mdi-bullhorn',
      menuSort: 70,
      menuHide: true,
    },
  },
  {
    path: '/adv-sources/create',
    name: 'advSourceCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'adv_sources_create',
      menuTitle: 'modules.advSources.single',
      menuHide: true,
    },
  },
  {
    path: '/adv-sources/:id',
    name: 'advSourceEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'adv_sources_view',
      menuTitle: 'modules.advSources.single',
      menuHide: true,
    },
  },
]
