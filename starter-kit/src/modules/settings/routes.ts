import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/settings',
    name: 'settingsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      // Убрали permission - теперь доступно всем авторизованным
      menuTitle: 'modules.settings.title',
      menuIcon: 'mdi-cog',
      menuSort: 100,
    },
  },
]
