import type { RouteMeta, RouteRecordRaw } from 'vue-router'

/**
 * @description Обязательные метаданные о странице
 */
export interface ICrudRouteMeta extends RouteMeta {

  /** Подпись в меню */
  menuTitle: string

  /** Иконка в меню */
  menuIcon?: string

  /** Сортировка в меню */
  menuSort?: number

  /** Name родителя */
  menuParenName?: string

  /** Список разрешений, по которым разрешен доступ */
  permissions?: string[]

  /** Список разрешений, по которым разрешен доступ */
  menuHide?: boolean
}

export type TCrudRouteRecord = RouteRecordRaw & {

  /** Информация о маршрутизации страницы */
  meta: ICrudRouteMeta
}
