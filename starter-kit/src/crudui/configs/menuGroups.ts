export const menuGroups = {
  sales: {
    name: 'sales',
    title: 'Продажи',
    menuSort: 70,
    icon: 'trending_up',
  },
  company: {
    name: 'company',
    title: 'Компания',
    menuSort: 20,
    icon: 'inventory_2',
  },
} as const

export type MenuGroupKey = keyof typeof menuGroups
