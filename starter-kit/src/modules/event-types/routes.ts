import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/event-types',
    name: 'eventTypesIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'event_types_index',
      menuTitle: 'modules.eventTypes.title',
      menuIcon: 'mdi-calendar-clock',
      menuSort: 60,
      menuHide: true,
    },
  },
  {
    path: '/event-types/create',
    name: 'eventTypeCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'event_types_create',
      menuTitle: 'modules.eventTypes.single',
      menuHide: true,
    },
  },
  {
    path: '/event-types/:id',
    name: 'eventTypeEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'event_types_view',
      menuTitle: 'modules.eventTypes.single',
      menuHide: true,
    },
  },
]
