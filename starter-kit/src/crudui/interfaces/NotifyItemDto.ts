export interface NotifyItemDto {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  created_at: string
  read_at?: string
}
