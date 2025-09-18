import { createMongoAbility } from '@casl/ability'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'view' | 'access'

// Определяем субъекты (ресурсы) системы - расширяем для всех модулей
export type Subjects =
  | 'User'
  | 'Client'
  | 'Deal'
  | 'Product'
  | 'Dashboard'
  | 'Settings'
  | 'Subscription'
  | 'Organization'
  | 'Route' // для проверки доступа к роутам
  | 'Permission' // для работы с permissions
  | 'all' // для полного доступа
  | string // для поддержки динамических субъектов

export interface Rule {
  action: Actions | string
  subject: Subjects
  conditions?: any
  inverted?: boolean
}

export const ability = createMongoAbility<[Actions | string, Subjects]>()
