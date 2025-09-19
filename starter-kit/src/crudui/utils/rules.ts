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

export const rules = {
  required: (message = 'Обязательное поле'): ValidationRule => {
    return (value: unknown) => {
      if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) {
        return message
      }

      return !!String(value).trim().length || message
    }
  },

  email: (message = 'Введите корректный email'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      const re =
        /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i

      if (Array.isArray(value)) {
        return value.every(val => re.test(String(val))) || message
      }

      return re.test(String(value)) || message
    }
  },

  password: (
    message = 'Пароль должен содержать минимум 8 символов, включая заглавную и строчную буквы, цифру и спецсимвол',
  ): ValidationRule => {
    return (value: string) => {
      if (isEmpty(value)) {
        return true
      }

      const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
      const validPassword = regExp.test(value)

      return validPassword || message
    }
  },

  confirmed: (target: string, message = 'Поля не совпадают'): ValidationRule => {
    return (value: string) => {
      return value === target || message
    }
  },

  between: (min: number, max: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const defaultMessage = `Введите число от ${min} до ${max}`
      if (isEmpty(value)) {
        return true
      }

      const valueAsNumber = Number(value)

      return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || message || defaultMessage
    }
  },

  integer: (message = 'Поле должно быть целым числом'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      if (Array.isArray(value)) {
        return value.every(val => /^-?\d+$/.test(String(val))) || message
      }

      return /^-?\d+$/.test(String(value)) || message
    }
  },

  regex: (pattern: RegExp | string, message = 'Неверный формат поля'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      let regeX = pattern
      if (typeof regeX === 'string') {
        regeX = new RegExp(regeX)
      }

      if (Array.isArray(value)) {
        return value.every(val => regeX.test(String(val))) || message
      }

      return regeX.test(String(value)) || message
    }
  },

  alpha: (message = 'Поле может содержать только буквы'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return /^[A-Z]*$/i.test(String(value)) || message
    }
  },

  url: (message = 'Некорректный URL'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      const re = /^https?:\/\/[^\s$.?#].\S*$/

      return re.test(String(value)) || message
    }
  },

  length: (length: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const defaultMessage = `Длина поля должна быть ${length} символов`
      if (isEmpty(value)) {
        return true
      }

      return String(value).length === length || message || defaultMessage
    }
  },

  alphaDash: (message = 'Недопустимые символы'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      const valueAsString = String(value)

      return /^[\w-]*$/.test(valueAsString) || message
    }
  },

  minLength: (min: number, message?: string): ValidationRule => {
    const defaultMessage = `Минимум ${min} символов`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return String(value).length >= min || message || defaultMessage
    }
  },

  maxLength: (max: number, message?: string): ValidationRule => {
    const defaultMessage = `Максимум ${max} символов`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return String(value).length <= max || message || defaultMessage
    }
  },

  number: (message = 'Поле должно быть числом'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return (typeof Number(value) === 'number' && !Number.isNaN(value)) || message
    }
  },

  numberMin: (min: number, message?: string): ValidationRule => {
    const defaultMessage = `Значение должно быть больше ${min}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return Number(value) >= min || message || defaultMessage
    }
  },

  numberMax: (max: number, message?: string): ValidationRule => {
    const defaultMessage = `Значение должно быть меньше ${max}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return Number(value) <= max || message || defaultMessage
    }
  },

  numberMaxInt: (message?: string): ValidationRule => {
    const max = 2147483647
    const defaultMessage = `Значение должно быть меньше ${max}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return Number(value) <= max || message || defaultMessage
    }
  },

  numberOrArray: (message = 'Поле должно быть числом или массивом чисел'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      const isValidNumber = (v: unknown) => typeof Number(v) === 'number' && !Number.isNaN(v)

      const isValidArray = (arr: unknown) => Array.isArray(arr) && arr.every(isValidNumber)

      return isValidNumber(value) || isValidArray(value) || message
    }
  },

  decimal: (decimals = 2, message?: string): ValidationRule => {
    const defaultMessage = `Число должно иметь не более ${decimals} знаков после запятой`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }
      const regex = new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`)

      return regex.test(String(value)) || message || defaultMessage
    }
  },

  phone: (message = 'Некорректный номер телефона'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      const phoneRegex = /^\+?\(?\d{1,3}\)?[-\s.]?\(?\d{1,4}\)?[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/

      return phoneRegex.test(String(value)) || message
    }
  },

  date: (message = 'Некорректная дата'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }
      const date = new Date(String(value))

      return !Number.isNaN(date.getTime()) || message
    }
  },

  dateAfter: (afterDate: string | Date, message?: string): ValidationRule => {
    const defaultMessage = `Дата должна быть после ${afterDate}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }
      const date = new Date(String(value))
      const after = new Date(afterDate)

      return date > after || message || defaultMessage
    }
  },

  dateBefore: (beforeDate: string | Date, message?: string): ValidationRule => {
    const defaultMessage = `Дата должна быть до ${beforeDate}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }
      const date = new Date(String(value))
      const before = new Date(beforeDate)

      return date < before || message || defaultMessage
    }
  },

  oneOf: (options: any[], message?: string): ValidationRule => {
    const defaultMessage = `Значение должно быть одним из: ${options.join(', ')}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return options.includes(value) || message || defaultMessage
    }
  },

  notOneOf: (options: any[], message?: string): ValidationRule => {
    const defaultMessage = `Значение не должно быть одним из: ${options.join(', ')}`

    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return !options.includes(value) || message || defaultMessage
    }
  },

  custom: (validator: (value: any) => boolean, message = 'Некорректное значение'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) {
        return true
      }

      return validator(value) || message
    }
  },
}

export type Rules = typeof rules

export default rules
