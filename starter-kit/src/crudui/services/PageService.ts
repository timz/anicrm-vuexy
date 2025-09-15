import type { Ref } from 'vue';
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import type { ICrudRouteMeta } from '@crud/interfaces/CrudRouterInterface'

export function setPageTitle(newTitle: string) {
  const pageTitle: Ref<string> | undefined = inject('pageTitle')
  if (pageTitle) {
    pageTitle.value = newTitle
  }
}

// export function getPkFromRoute(idAttribute = 'id') {
//   const currentRoute = useRoute()
//   return <string>currentRoute.params[idAttribute] || null
// }

export function setPageTitleFromMenuTitle() {
  const currentRoute = useRoute()
  const pageTitle: Ref<string> | undefined = inject('pageTitle')
  if (pageTitle) {
    const meta = currentRoute.meta as ICrudRouteMeta
    pageTitle.value = meta.menuTitle || 'meta.menuTitle не указано'
  }
}
