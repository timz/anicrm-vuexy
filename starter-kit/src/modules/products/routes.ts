import type { TCrudRouteRecord } from '@crudui/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/products',
    name: 'productsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'products_index',
      menuTitle: 'modules.products.title',
      menuIcon: 'mdi-package-variant',
      menuSort: 40,
    },
  },
  {
    path: '/products/create',
    name: 'productCreate',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'products_create',
      menuTitle: 'modules.products.single',
      menuHide: true,
    },
  },
  {
    path: '/products/:id',
    name: 'productEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'products_view',
      menuTitle: 'modules.products.single',
      menuHide: true,
    },
  },
]
