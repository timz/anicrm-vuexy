import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/equipments',
    name: 'equipmentsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'equipments_index',
      menuTitle: 'Оборудование',
      menuIcon: 'mdi-tools',
      menuSort: 50,
    },
  },
  {
    path: '/equipments/create',
    name: 'equipmentCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'equipments_create',
      menuTitle: 'Оборудование',
      menuHide: true,
    },
  },
  {
    path: '/equipments/:id',
    name: 'equipmentEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'equipments_view',
      menuTitle: 'Оборудование',
      menuHide: true,
    },
  },
]
