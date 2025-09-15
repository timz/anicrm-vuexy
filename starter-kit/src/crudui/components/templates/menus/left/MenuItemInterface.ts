export interface MenuItemInterface {
  name: string
  title: string
  path: string
  icon: string
  target?: string
  isChild?: boolean
  menuSort?: number
  menuParenName?: string
  childItems?: MenuItemInterface[]
  permissions?: string[]
}