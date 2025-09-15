import { i18n } from '@crudui/boot/i18n'

const t = i18n.global.t
const isEmpty = (val: string | number): boolean => val == null || val == ''

export default {
  strMaxLength: (maxLength: number) => {
    const errMsg = `Поле должно быть короче ${maxLength} символов`
    return (val: string) => isEmpty(val) || val.length <= maxLength || errMsg
  },
  strMinLength: (minLength: number) => {
    const errMsg = `Поле должно быть длиннее ${minLength} символов`
    return (val: string) => isEmpty(val) || val.length >= minLength || errMsg
  },
  required: (errMsg = t('validation.required')) => {
    return (value?: string | number | boolean) => {
      if (typeof value === 'boolean') return true;
      if (value === null || value === undefined) return errMsg;
      if (typeof value === 'string') return value.trim() !== '' ? true : errMsg;
      if (Array.isArray(value)) return value.length > 0 ? true : errMsg;
      if (typeof value === 'number') return !Number.isNaN(value) ? true : errMsg;
      return true;
    };
  },
  number: (val?: string | number, errMsg = 'Поле должно быть числом') => {
    return (val: string | number) => isEmpty(val) || (typeof Number(val) === 'number' && !isNaN(Number(val))) || errMsg
  },
  numberMin: (min: number) => {
    const errMsg = `Поле должно быть больше ${min}`
    return (val: number) => isEmpty(val) || val >= min || errMsg
  },
  numberMax: (max: number) => {
    const errMsg = `Поле должно быть меньше ${max}`
    return (val: number) => isEmpty(val) || val <= max || errMsg
  },
  numberMaxInt: () => {
    const max= 2147483647
    const errMsg = `Поле должно быть меньше ${max}`
    return (val: number) => isEmpty(val) || val <= max || errMsg
  },
  numberOrArray: (val?: string | number | Array<number | string>, errMsg = 'Поле должно быть числом или списком чисел') => {
    return (val: string | number | Array<number | string>) => {
      const isValidNumber = (v:unknown) => typeof Number(v) === 'number' && !isNaN(Number(v));
      const isValidArray = (arr:unknown) => Array.isArray(arr) && arr.every(isValidNumber);
      return isEmpty(val) || isValidNumber(val) || isValidArray(val) || errMsg;
    };
  },
  email: (errMsg = 'Введите правильный email') => {
    const emailRegex = /^[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.\p{L}{2,}$/u
    return (val: string) => isEmpty(val) || emailRegex.test(val) || errMsg
  }
}