import type { Event, NewEvent } from './types'
import { secureApi } from '@/services/AxiosService'

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    availableCalendars: [
      {
        color: 'error',
        label: 'Personal',
      },
      {
        color: 'primary',
        label: 'Business',
      },
      {
        color: 'warning',
        label: 'Family',
      },
      {
        color: 'success',
        label: 'Holiday',
      },
      {
        color: 'info',
        label: 'ETC',
      },
    ],
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'],
  }),
  actions: {
    async fetchEvents() {
      try {
        const response = await secureApi.get<Event[]>('/apps/calendar', {
          params: {
            calendars: this.selectedCalendars,
          },
        })

        return response.data
      } catch (error) {
        console.error('Error fetching calendar events:', error)
        throw error
      }
    },
    async addEvent(event: NewEvent) {
      try {
        await secureApi.post('/apps/calendar', event)
      } catch (error) {
        console.error('Error adding calendar event:', error)
        throw error
      }
    },
    async updateEvent(event: Event) {
      try {
        const response = await secureApi.put<Event>(`/apps/calendar/${event.id}`, event)

        return response.data
      } catch (error) {
        console.error('Error updating calendar event:', error)
        throw error
      }
    },
    async removeEvent(eventId: string) {
      try {
        await secureApi.delete(`/apps/calendar/${eventId}`)
      } catch (error) {
        console.error('Error removing calendar event:', error)
        throw error
      }
    },
  },
})
