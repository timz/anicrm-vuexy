import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/measures',
    name: 'measuresIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'measures_index',
      menuTitle: 'Единицы измерения',
      menuIcon: 'mdi-ruler',
      menuSort: 90,
    },
  },
  {
    path: '/measures/create',
    name: 'measureCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'measures_create',
      menuTitle: 'Единица измерения',
      menuHide: true,
    },
  },
  {
    path: '/measures/:id',
    name: 'measureEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'measures_view',
      menuTitle: 'Единица измерения',
      menuHide: true,
    },
  },
]