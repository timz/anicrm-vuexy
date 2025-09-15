import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/home',
    name: 'dashboardIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'min_permission',
      title: 'Главная панель',
      menuTitle: 'Главная',
      menuIcon: 'mdi-home',
      menuSort: 0,
    },
  },
]