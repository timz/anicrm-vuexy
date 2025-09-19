import type { ComputedRef, Ref } from 'vue'
import { computed, ref, shallowRef, unref } from 'vue'
import type { AxiosInstance } from 'axios'
import { secureApi } from '@crudui/services/AxiosService'

export interface CrudDataListPagination {
  page: number
  rowsPerPage: number
  rowsNumber?: number
  sortBy: string
  descending: boolean
}

export interface CrudDataListSorting {
  sortBy: string
  descending: boolean
}

export interface CrudDataListRequest {
  filter?: Record<string, unknown>
  sorting?: CrudDataListSorting
  pagination?: CrudDataListPagination
}

export interface CrudDataListResponse<T> {
  success: boolean
  code: number
  error?: string
  message?: string
  content: {
    items: T[]
    total: number
  }
}

export interface CrudRowAction<T> {
  name: string
  label?: string
  icon?: string
  color?: string
  class?: string
  show?: (item: T) => boolean
  handler: (item: T) => void | Promise<void>
}

export interface CrudDataListConfig<T = Record<string, unknown>> {
  readonly mode: 'table' | 'list'
  readonly urlBase: string
  readonly urlList?: string
  readonly urlDelete?: string
  readonly urlUnlink?: string
  readonly pk?: string
  readonly columns?: unknown[]
  readonly defaultPage?: number
  readonly defaultRowsPerPage?: number
  readonly rowActions?: CrudRowAction<T>[]
  readonly persistentFilter?: Record<string, unknown> | ComputedRef<Record<string, unknown>>
}

export interface UseCrudDataListReturn<T extends Record<string, unknown>> {
  readonly listItems: Ref<T[]>
  readonly selectedItems: Ref<T[]>
  readonly selectedIds: ComputedRef<unknown[]>
  readonly pagination: Ref<CrudDataListPagination>
  readonly loading: Ref<boolean>
  readonly total: Ref<number>
  readonly filter: Ref<Record<string, unknown>>
  readonly columns: unknown[]
  readonly pk: string
  readonly rowActions: CrudRowAction<T>[]

  readonly loadList: (customFilter?: Record<string, unknown>) => Promise<CrudDataListResponse<T>>
  readonly refresh: () => Promise<CrudDataListResponse<T>>
  readonly remove: (ids: unknown[]) => Promise<unknown>
  readonly unlink: (id: unknown, linkId: unknown) => Promise<unknown>
  readonly download: (fileURL: string) => void
  readonly loadingOn: () => void
  readonly loadingOff: () => void
  readonly clearSelection: () => void
  readonly isSelected: (id: unknown) => boolean
  readonly toggleSelection: (item: T) => void
  readonly updatePagination: (newPagination: Partial<CrudDataListPagination>) => void
  readonly updateSorting: (sortBy: string, descending: boolean) => void
}

export function useCrudDataList<T extends Record<string, unknown>>(
  config: CrudDataListConfig<T>,
): UseCrudDataListReturn<T> {
  const http: AxiosInstance = secureApi
  const pkField = config.pk ?? 'id'

  // State
  const listItems = ref<T[]>([])
  const selectedItems = shallowRef<T[]>([])
  const loading = ref<boolean>(false)
  const total = ref<number>(0)
  const filter = ref<Record<string, unknown>>({})

  // Pagination state
  const pagination = ref<CrudDataListPagination>({
    page: config.defaultPage ?? 1,
    rowsPerPage: config.defaultRowsPerPage ?? 12,
    sortBy: '',
    descending: false,
  })

  // Computed
  const selectedIds = computed<unknown[]>(() =>
    selectedItems.value.map(item => item[pkField]),
  )

  // URLs
  const getListUrl = (): string => config.urlList ?? `${config.urlBase}`
  const getDeleteUrl = (): string => config.urlDelete ?? `${config.urlBase}/delete`
  const getUnlinkUrl = (): string => config.urlUnlink ?? `${config.urlBase}/unlink`

  // Methods
  function loadingOn(): void {
    loading.value = true
  }

  function loadingOff(): void {
    loading.value = false
  }

  function clearSelection(): void {
    selectedItems.value = []
  }

  function isSelected(id: unknown): boolean {
    return selectedIds.value.includes(id)
  }

  function toggleSelection(item: T): void {
    const id = item[pkField]
    const index = selectedItems.value.findIndex(selected => selected[pkField] === id)

    if (index >= 0) {
      selectedItems.value.splice(index, 1)
    }
    else {
      selectedItems.value.push(item)
    }
  }

  function updatePagination(newPagination: Partial<CrudDataListPagination>): void {
    Object.assign(pagination.value, newPagination)
  }

  function updateSorting(sortBy: string, descending: boolean): void {
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  }

  async function loadList(customFilter?: Record<string, unknown>): Promise<CrudDataListResponse<T>> {
    loadingOn()
    try {
      const persistentFilterValue = config.persistentFilter ? unref(config.persistentFilter) : {}

      const requestData: CrudDataListRequest = {
        filter: {
          ...persistentFilterValue,
          ...(customFilter ?? filter.value),
        },
        sorting: {
          sortBy: pagination.value.sortBy,
          descending: pagination.value.descending,
        },
        pagination: pagination.value,
      }

      const { data } = await http.post<CrudDataListResponse<T>>(getListUrl(), requestData)

      if (data.success && data.content) {
        listItems.value = data.content.items
        total.value = data.content.total

        // Обновляем пагинацию с общим количеством записей
        pagination.value.rowsNumber = data.content.total
      }

      return data
    }
    finally {
      loadingOff()
    }
  }

  async function refresh(): Promise<CrudDataListResponse<T>> {
    return await loadList()
  }

  async function deleteRecords(ids: unknown[]): Promise<unknown> {
    loadingOn()
    try {
      const { data } = await http.post(getDeleteUrl(), { ids })

      // Обновляем список после удаления
      await refresh()
      clearSelection()

      return data
    }
    catch (error) {
      console.error('Delete operation failed:', error)
      throw error
    }
    finally {
      loadingOff()
    }
  }

  async function unlink(id: unknown, linkId: unknown): Promise<unknown> {
    loadingOn()
    try {
      // TODO: уточнить структуру параметров для unlink
      const { data } = await http.post(getUnlinkUrl(), { id, linkId })

      // Обновляем список после отвязки
      await refresh()
      clearSelection()

      return data
    }
    catch (error) {
      console.error('Unlink operation failed:', error)
      throw error
    }
    finally {
      loadingOff()
    }
  }

  function download(fileURL: string): void {
    try {
      const link = document.createElement('a')

      link.href = fileURL
      link.download = ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  }

  return {
    listItems: listItems as Ref<T[]>,
    selectedItems: selectedItems as Ref<T[]>,
    selectedIds,
    pagination,
    loading,
    total,
    filter,
    columns: config.columns ?? [],
    pk: pkField,
    rowActions: config.rowActions ?? [],
    loadList,
    refresh,
    remove: deleteRecords,
    unlink,
    download,
    loadingOn,
    loadingOff,
    clearSelection,
    isSelected,
    toggleSelection,
    updatePagination,
    updateSorting,
  } as const
}
