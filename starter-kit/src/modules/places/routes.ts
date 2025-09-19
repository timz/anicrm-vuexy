import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/places',
    name: 'placesIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'places_index',
      menuTitle: 'Места',
      menuIcon: 'mdi-map-marker',
      menuSort: 20,
    },
  },

]
