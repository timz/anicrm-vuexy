import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/measures',
    name: 'measuresIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'measures_index',
      menuTitle: 'modules.measures.title',
      menuIcon: 'mdi-ruler',
      menuSort: 90,
      menuHide: true,
    },
  },
  {
    path: '/measures/create',
    name: 'measureCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'measures_create',
      menuTitle: 'modules.measures.single',
      menuHide: true,
    },
  },
  {
    path: '/measures/:id',
    name: 'measureEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'measures_view',
      menuTitle: 'modules.measures.single',
      menuHide: true,
    },
  },
]
