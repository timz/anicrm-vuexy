import { i18n } from '@crudui/boot/i18n'

export interface ValidationRule {
  (value: any): boolean | string
}

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') {
    return true
  }

  return Array.isArray(value) && value.length === 0
}

const isNullOrUndefined = (value: unknown): value is undefined | null => {
  return value === null || value === undefined
}

const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0
}

const { t } = i18n.global

export const rules = {
  required: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.required')
      if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) {
        return msg
      }

      return !!String(value).trim().length || msg
    }
  },

  email: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.email')
      if (isEmpty(value)) {
        return true
      }

      const re =
        /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i

      if (Array.isArray(value)) {
        return value.every(val => re.test(String(val))) || msg
      }

      return re.test(String(value)) || msg
    }
  },

  password: (message?: string): ValidationRule => {
    return (value: string) => {
      const msg = message || t('validation.password')
      if (isEmpty(value)) {
        return true
      }

      const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
      const validPassword = regExp.test(value)

      return validPassword || msg
    }
  },

  confirmed: (target: string, message?: string): ValidationRule => {
    return (value: string) => {
      const msg = message || t('validation.confirmed')

      return value === target || msg
    }
  },

  between: (min: number, max: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.between', { min, max })
      if (isEmpty(value)) {
        return true
      }

      const valueAsNumber = Number(value)

      return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || msg
    }
  },

  integer: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.integer')
      if (isEmpty(value)) {
        return true
      }

      if (Array.isArray(value)) {
        return value.every(val => /^-?\d+$/.test(String(val))) || msg
      }

      return /^-?\d+$/.test(String(value)) || msg
    }
  },

  regex: (pattern: RegExp | string, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.regex')
      if (isEmpty(value)) {
        return true
      }

      let regeX = pattern
      if (typeof regeX === 'string') {
        regeX = new RegExp(regeX)
      }

      if (Array.isArray(value)) {
        return value.every(val => regeX.test(String(val))) || msg
      }

      return regeX.test(String(value)) || msg
    }
  },

  alpha: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.alpha')
      if (isEmpty(value)) {
        return true
      }

      return /^[A-Z]*$/i.test(String(value)) || msg
    }
  },

  url: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.url')
      if (isEmpty(value)) {
        return true
      }

      const re = /^https?:\/\/[^\s$.?#].\S*$/

      return re.test(String(value)) || msg
    }
  },

  length: (length: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.length', { length })
      if (isEmpty(value)) {
        return true
      }

      return String(value).length === length || msg
    }
  },

  alphaDash: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.alphaDash')
      if (isEmpty(value)) {
        return true
      }

      const valueAsString = String(value)

      return /^[\w-]*$/.test(valueAsString) || msg
    }
  },

  minLength: (min: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.minLength', { min })
      if (isEmpty(value)) {
        return true
      }

      return String(value).length >= min || msg
    }
  },

  maxLength: (max: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.maxLength', { max })
      if (isEmpty(value)) {
        return true
      }

      return String(value).length <= max || msg
    }
  },

  number: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.number')
      if (isEmpty(value)) {
        return true
      }

      return (typeof Number(value) === 'number' && !Number.isNaN(value)) || msg
    }
  },

  numberMin: (min: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.numberMin', { min })
      if (isEmpty(value)) {
        return true
      }

      return Number(value) >= min || msg
    }
  },

  numberMax: (max: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.numberMax', { max })
      if (isEmpty(value)) {
        return true
      }

      return Number(value) <= max || msg
    }
  },

  numberMaxInt: (message?: string): ValidationRule => {
    const max = 2147483647

    return (value: unknown) => {
      const msg = message || t('validation.numberMaxInt', { max })
      if (isEmpty(value)) {
        return true
      }

      return Number(value) <= max || msg
    }
  },

  numberOrArray: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.numberOrArray')
      if (isEmpty(value)) {
        return true
      }

      const isValidNumber = (v: unknown) => typeof Number(v) === 'number' && !Number.isNaN(v)

      const isValidArray = (arr: unknown) => Array.isArray(arr) && arr.every(isValidNumber)

      return isValidNumber(value) || isValidArray(value) || msg
    }
  },

  decimal: (decimals = 2, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.decimal', { decimals })
      if (isEmpty(value)) {
        return true
      }
      const regex = new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`)

      return regex.test(String(value)) || msg
    }
  },

  phone: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.phone')
      if (isEmpty(value)) {
        return true
      }

      const phoneRegex = /^\+?\(?\d{1,3}\)?[-\s.]?\(?\d{1,4}\)?[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/

      return phoneRegex.test(String(value)) || msg
    }
  },

  date: (message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.date')
      if (isEmpty(value)) {
        return true
      }
      const date = new Date(String(value))

      return !Number.isNaN(date.getTime()) || msg
    }
  },

  dateAfter: (afterDate: string | Date, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.dateAfter', { afterDate: afterDate.toString() })
      if (isEmpty(value)) {
        return true
      }
      const date = new Date(String(value))
      const after = new Date(afterDate)

      return date > after || msg
    }
  },

  dateBefore: (beforeDate: string | Date, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.dateBefore', { beforeDate: beforeDate.toString() })
      if (isEmpty(value)) {
        return true
      }
      const date = new Date(String(value))
      const before = new Date(beforeDate)

      return date < before || msg
    }
  },

  oneOf: (options: any[], message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.oneOf', { options: options.join(', ') })
      if (isEmpty(value)) {
        return true
      }

      return options.includes(value) || msg
    }
  },

  notOneOf: (options: any[], message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.notOneOf', { options: options.join(', ') })
      if (isEmpty(value)) {
        return true
      }

      return !options.includes(value) || msg
    }
  },

  custom: (validator: (value: any) => boolean, message?: string): ValidationRule => {
    return (value: unknown) => {
      const msg = message || t('validation.custom')
      if (isEmpty(value)) {
        return true
      }

      return validator(value) || msg
    }
  },
}

export type Rules = typeof rules

export default rules
