import { createMongoAbility } from '@casl/ability'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'

// Определяем субъекты (ресурсы) системы
export type Subjects =
  | 'User'
  | 'Client'
  | 'Deal'
  | 'Product'
  | 'Dashboard'
  | 'Settings'
  | 'all' // для полного доступа

export interface Rule {
  action: Actions
  subject: Subjects
}

export const ability = createMongoAbility<[Actions, Subjects]>()
