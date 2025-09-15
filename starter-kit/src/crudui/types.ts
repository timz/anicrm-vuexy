import type { Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

// Базовые типы для CRUD операций
export type FormModel = {
  id?: string | number | null
  [key: string]: unknown
}

export type CrudMode = 'create' | 'edit'
export type CrudResponse = { content?: Record<string, unknown> }

// Блоки конфигурации для композиции
export interface HttpConfig {
  readonly isSecure?: boolean
}

export interface ModelConfig<T extends FormModel = FormModel> {
  model: Ref<T>
  readonly transformOut?: (values: T) => unknown
  readonly transformIn?: (raw: unknown) => T
}

export interface UrlConfig {
  readonly prefixUrl: string
  readonly loadUrl?: string
  readonly createUrl?: string
  readonly updateUrl?: string
}

export interface FormConfig {
  readonly primaryKey?: string
  readonly responseKey?: string
  readonly successMessage?: string
}

export interface RouteConfig {
  routeIdParam?: string
  backRoute?: RouteLocationRaw
}