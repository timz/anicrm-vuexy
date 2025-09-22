export const menuGroups = {
  sales: {
    name: 'sales',
    title: 'navigation.sales',
    menuSort: 70,
    icon: 'trending_up',
  },
  company: {
    name: 'company',
    title: 'navigation.company',
    menuSort: 20,
    icon: 'inventory_2',
  },
} as const

export type MenuGroupKey = keyof typeof menuGroups
