import type { TCrudRouteRecord } from '@crud/interfaces/CrudRouterInterface'

export default <TCrudRouteRecord[]>[
  {
    path: '/products',
    name: 'productsIndex',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      permission: 'products_index',
      menuTitle: 'Продукты',
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
      menuTitle: 'Продукт',
      menuHide: true,
    },
  },
  {
    path: '/products/:id',
    name: 'productEdit',
    component: () => import('./components/EditPage.vue'),
    meta: {
      permission: 'products_view',
      menuTitle: 'Продукт',
      menuHide: true,
    },
  },
]