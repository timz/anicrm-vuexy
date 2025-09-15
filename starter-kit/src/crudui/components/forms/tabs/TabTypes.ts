import type { Component } from 'vue'

export interface TabContext {
  isNew: boolean
  parentId?: string | number
  formData?: Record<string, unknown>
  userPermissions?: string[]
  routeParams?: Record<string, unknown>
}

export interface CrudTabInterface {
  name: string
  label: string
  tab: Component
  visible?: (context: TabContext) => boolean
  meta?: Record<string, unknown>
  permissions?: string[]
  lazy?: boolean
  icon?: string
  badge?: string | number
}

export interface TabOption {
  label: string
  value: string
  icon?: string
  badge?: string | number
}