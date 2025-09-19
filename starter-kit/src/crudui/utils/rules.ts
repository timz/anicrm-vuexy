export interface ValidationRule {
  (value: any): boolean | string
}

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true

  return !!(Array.isArray(value) && value.length === 0)
}

const isNullOrUndefined = (value: unknown): value is undefined | null => {
  return value === null || value === undefined
}

const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0
}

export const rules = {
  required: (message = 'This field is required'): ValidationRule => {
    return (value: unknown) => {
      if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) return message

      return !!String(value).trim().length || message
    }
  },

  email: (message = 'The Email field must be a valid email'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      const re =
        /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i

      if (Array.isArray(value)) return value.every(val => re.test(String(val))) || message

      return re.test(String(value)) || message
    }
  },

  password: (
    message = 'Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars',
  ): ValidationRule => {
    return (value: string) => {
      if (isEmpty(value)) return true

      const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
      const validPassword = regExp.test(value)

      return validPassword || message
    }
  },

  confirmed: (target: string, message = 'The field confirmation does not match'): ValidationRule => {
    return (value: string) => {
      return value === target || message
    }
  },

  between: (min: number, max: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const defaultMessage = `Enter number between ${min} and ${max}`
      if (isEmpty(value)) return true

      const valueAsNumber = Number(value)

      return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || message || defaultMessage
    }
  },

  integer: (message = 'This field must be an integer'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      if (Array.isArray(value)) return value.every(val => /^-?\d+$/.test(String(val))) || message

      return /^-?\d+$/.test(String(value)) || message
    }
  },

  regex: (pattern: RegExp | string, message = 'The field format is invalid'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      let regeX = pattern
      if (typeof regeX === 'string') regeX = new RegExp(regeX)

      if (Array.isArray(value)) return value.every(val => regeX.test(String(val))) || message

      return regeX.test(String(value)) || message
    }
  },

  alpha: (message = 'The field may only contain alphabetic characters'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      return /^[A-Z]*$/i.test(String(value)) || message
    }
  },

  url: (message = 'URL is invalid'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      const re = /^https?:\/\/[^\s$.?#].\S*$/

      return re.test(String(value)) || message
    }
  },

  length: (length: number, message?: string): ValidationRule => {
    return (value: unknown) => {
      const defaultMessage = `The length of the field must be ${length} characters`
      if (isEmpty(value)) return true

      return String(value).length === length || message || defaultMessage
    }
  },

  alphaDash: (message = 'All characters are not valid'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      const valueAsString = String(value)

      return /^[\w-]*$/.test(valueAsString) || message
    }
  },

  minLength: (min: number, message?: string): ValidationRule => {
    const defaultMessage = `Field must be at least ${min} characters`

    return (value: unknown) => {
      if (isEmpty(value)) return true

      return String(value).length >= min || message || defaultMessage
    }
  },

  maxLength: (max: number, message?: string): ValidationRule => {
    const defaultMessage = `Field must be no more than ${max} characters`

    return (value: unknown) => {
      if (isEmpty(value)) return true

      return String(value).length <= max || message || defaultMessage
    }
  },

  min: (min: number, message?: string): ValidationRule => {
    const defaultMessage = `Value must be at least ${min}`

    return (value: unknown) => {
      if (isEmpty(value)) return true

      return Number(value) >= min || message || defaultMessage
    }
  },

  max: (max: number, message?: string): ValidationRule => {
    const defaultMessage = `Value must be no more than ${max}`

    return (value: unknown) => {
      if (isEmpty(value)) return true

      return Number(value) <= max || message || defaultMessage
    }
  },

  decimal: (decimals = 2, message?: string): ValidationRule => {
    const defaultMessage = `Field must be a valid decimal with up to ${decimals} decimal places`

    return (value: unknown) => {
      if (isEmpty(value)) return true
      const regex = new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`)

      return regex.test(String(value)) || message || defaultMessage
    }
  },

  phone: (message = 'Phone number is invalid'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true
      const phoneRegex = /^\+?\(?\d{1,3}\)?[-\s.]?\(?\d{1,4}\)?[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/

      return phoneRegex.test(String(value)) || message
    }
  },

  date: (message = 'Date is invalid'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true
      const date = new Date(String(value))

      return !Number.isNaN(date.getTime()) || message
    }
  },

  dateAfter: (afterDate: string | Date, message?: string): ValidationRule => {
    const defaultMessage = `Date must be after ${afterDate}`

    return (value: unknown) => {
      if (isEmpty(value)) return true
      const date = new Date(String(value))
      const after = new Date(afterDate)

      return date > after || message || defaultMessage
    }
  },

  dateBefore: (beforeDate: string | Date, message?: string): ValidationRule => {
    const defaultMessage = `Date must be before ${beforeDate}`

    return (value: unknown) => {
      if (isEmpty(value)) return true
      const date = new Date(String(value))
      const before = new Date(beforeDate)

      return date < before || message || defaultMessage
    }
  },

  oneOf: (options: any[], message?: string): ValidationRule => {
    const defaultMessage = `Value must be one of: ${options.join(', ')}`

    return (value: unknown) => {
      if (isEmpty(value)) return true

      return options.includes(value) || message || defaultMessage
    }
  },

  notOneOf: (options: any[], message?: string): ValidationRule => {
    const defaultMessage = `Value must not be one of: ${options.join(', ')}`

    return (value: unknown) => {
      if (isEmpty(value)) return true

      return !options.includes(value) || message || defaultMessage
    }
  },

  custom: (validator: (value: any) => boolean, message = 'Field is invalid'): ValidationRule => {
    return (value: unknown) => {
      if (isEmpty(value)) return true

      return validator(value) || message
    }
  },
}

export type Rules = typeof rules

export default rules
