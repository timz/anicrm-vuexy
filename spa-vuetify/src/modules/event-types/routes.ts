import type { TCrudRouteRecord } from '@crud/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/event-types',
    name: 'eventTypesIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'event_types_index',
      menuTitle: 'Типы событий',
      menuIcon: 'mdi-calendar-clock',
      menuSort: 60,
    },
  },
  {
    path: '/event-types/create',
    name: 'eventTypeCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'event_types_create',
      menuTitle: 'Тип события',
      menuHide: true,
    },
  },
  {
    path: '/event-types/:id',
    name: 'eventTypeEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'event_types_view',
      menuTitle: 'Тип события',
      menuHide: true,
    },
  },
]