import type { TCrudRouteRecord } from '@crud/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/settings',
    name: 'settingsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'settings_index',
      menuTitle: 'Настройки',
      menuIcon: 'mdi-cog',
      menuSort: 100,
    },
  },
]