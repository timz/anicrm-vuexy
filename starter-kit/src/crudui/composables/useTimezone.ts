import { computed } from 'vue'
import { useMeStore } from '@crudui/stores/meStore'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export function useTimezone() {
  const meStore = useMeStore()

  const timezone = computed(() => meStore.timezone)

  const formatDateWithTimezone = (date: Date | string, includeSeconds = false): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    if (includeSeconds) {
      options.second = '2-digit'
    }
    
    if (timezone.value) {
      options.timeZone = timezone.value
    }

    return dateObj.toLocaleString('ru-RU', options)
      .replace(',', '')
  }

  const formatTimeWithTimezone = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (!timezone.value) {
      return dateObj.toLocaleTimeString()
    }

    return dateObj.toLocaleTimeString('ru-RU', {
      timeZone: timezone.value,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrentTimezoneOffset = (): number => {
    if (!timezone.value) {
      return new Date().getTimezoneOffset()
    }
    
    const now = new Date()
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone.value }))
    
    return (utc.getTime() - targetTime.getTime()) / 60000
  }

  const formatDateWithTimezoneNoSeconds = (date: Date | string): string => {
    return formatDateWithTimezone(date, false)
  }

  const formatDateWithTimezoneWithSeconds = (date: Date | string): string => {
    return formatDateWithTimezone(date, true)
  }

  const parseISOToLocal = (isoString: string | null, includeSeconds = false): string => {
    if (!isoString) return ''
    
    // Парсим как UTC время
    let dateObj: dayjs.Dayjs = dayjs.utc(isoString)
    
    if (!dateObj.isValid()) {
      return ''
    }

    // Применяем timezone если задан - конвертируем UTC в локальную timezone
    if (timezone.value) {
      dateObj = dateObj.tz(timezone.value)
    }

    // Форматируем в локальном формате (ru-RU)
    const formatStr = includeSeconds ? 'DD.MM.YYYY HH:mm:ss' : 'DD.MM.YYYY HH:mm'
    const result = dateObj.format(formatStr)
    return result
  }

  const formatLocalToISO = (localString: string | null, includeSeconds = false): string | null => {
    if (!localString || localString.trim() === '') return null
    
    // Парсим локальный формат
    let dateObj: dayjs.Dayjs
    
    // Пробуем разные форматы
    if (includeSeconds || localString.split(':').length === 3) {
      // С секундами: ДД.ММ.ГГГГ ЧЧ:ММ:СС
      dateObj = dayjs(localString, 'DD.MM.YYYY HH:mm:ss', true)
    } else {
      // Без секунд: ДД.ММ.ГГГГ ЧЧ:ММ
      dateObj = dayjs(localString, 'DD.MM.YYYY HH:mm', true)
    }

    if (!dateObj.isValid()) {
      return null
    }

    // Если секунды не включены, устанавливаем их в 0
    if (!includeSeconds) {
      dateObj = dateObj.second(0).millisecond(0)
    }

    // Применяем timezone если задан - считаем что ввод в локальной timezone
    if (timezone.value) {
      dateObj = dateObj.tz(timezone.value, true)
    }

    // Конвертируем в UTC для отправки на сервер
    const isoString = dateObj.utc().format('YYYY-MM-DDTHH:mm:ss.SSS')
    
    // Добавляем микросекунды (заменяем миллисекунды)
    const result = isoString.replace(/(\.\d{3})$/, '$1000')
    return result
  }

  const normalizeToISO = (value: string | null): string | null => {
    if (!value) return null
    
    // Если уже в ISO формате с микросекундами, возвращаем как есть
    if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}$/)) {
      return value
    }
    
    // Если в локальном формате, конвертируем
    if (value.match(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}(:\d{2})?$/)) {
      return formatLocalToISO(value, value.includes(':') && value.split(':').length === 3)
    }
    
    // Если в промежуточном формате (YYYY-MM-DD HH:mm:ss), конвертируем в ISO
    if (value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      const dateObj = dayjs(value, 'YYYY-MM-DD HH:mm:ss')
      if (dateObj.isValid()) {
        return dateObj.toISOString().replace(/(\.\d{3})Z$/, '$1000')
      }
    }
    
    return value
  }

  // Helper функция для календарей - конвертирует UTC в локальную timezone
  const parseUTCToLocalForCalendar = (utcString: string | null, format: string): string => {
    if (!utcString) return format === 'YYYY/MM/DD' ? dayjs().format('YYYY/MM/DD') : '00:00'
    
    let dateObj = dayjs.utc(utcString)
    if (!dateObj.isValid()) return format === 'YYYY/MM/DD' ? dayjs().format('YYYY/MM/DD') : '00:00'
    
    // Применяем timezone если задан
    if (timezone.value) {
      dateObj = dateObj.tz(timezone.value)
    }
    
    return dateObj.format(format)
  }

  // Специализированная функция для отображения дат в таблицах
  const formatTableDate = (dateString: string | null): string => {
    return parseISOToLocal(dateString, false)
  }

  // Функции для работы только с датами (без времени)
  const parseDateISOToLocal = (isoString: string | null): string => {
    if (!isoString) return ''
    
    // Парсим как UTC дату
    let dateObj: dayjs.Dayjs = dayjs.utc(isoString)
    
    if (!dateObj.isValid()) {
      return ''
    }

    // Применяем timezone если задан - конвертируем UTC в локальную timezone
    if (timezone.value) {
      dateObj = dateObj.tz(timezone.value)
    }

    // Форматируем только дату в локальном формате (ru-RU)
    return dateObj.format('DD.MM.YYYY')
  }

  const formatLocalDateToISO = (localString: string | null): string | null => {
    if (!localString || localString.trim() === '') return null
    
    // Парсим локальный формат даты
    const dateObj = dayjs(localString, 'DD.MM.YYYY', true)

    if (!dateObj.isValid()) {
      return null
    }

    // Применяем timezone если задан - считаем что ввод в локальной timezone
    let resultObj = dateObj
    if (timezone.value) {
      resultObj = dateObj.tz(timezone.value, true)
    }

    // Конвертируем в UTC только дату (время в начале дня)
    return resultObj.utc().startOf('day').format('YYYY-MM-DD')
  }

  // Helper функция для календарей дат - конвертирует UTC дату в локальную timezone
  const parseUTCDateToLocalForCalendar = (utcString: string | null): string => {
    if (!utcString) return dayjs().format('YYYY/MM/DD')
    
    let dateObj = dayjs.utc(utcString)
    if (!dateObj.isValid()) return dayjs().format('YYYY/MM/DD')
    
    // Применяем timezone если задан
    if (timezone.value) {
      dateObj = dateObj.tz(timezone.value)
    }
    
    return dateObj.format('YYYY/MM/DD')
  }

  return {
    timezone,
    formatDateWithTimezone,
    formatDateWithTimezoneNoSeconds,
    formatDateWithTimezoneWithSeconds,
    formatTimeWithTimezone,
    getCurrentTimezoneOffset,
    parseISOToLocal,
    formatLocalToISO,
    normalizeToISO,
    parseUTCToLocalForCalendar,
    formatTableDate,
    parseDateISOToLocal,
    formatLocalDateToISO,
    parseUTCDateToLocalForCalendar
  }
}