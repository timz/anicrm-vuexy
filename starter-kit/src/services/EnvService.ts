interface EnvType {
  string: string
  number: number
  boolean: boolean
  array: string[]
}

export const parseEnv = <K extends keyof EnvType, T extends EnvType[K]>(
  val: string,
  toType: K,
): T => {
  switch (toType) {
    case 'string':
      return val as T
    case 'number':
      return Number.parseInt(val, 10) as unknown as T
    case 'boolean':
    // '0' or '1'
    // 'false' or 'true'
      if (val === '0' || val === 'false')
        return false as T

      if (val === '1' || val === 'true')
        return true as T

      return false as T
    case 'array':
      return val.split(',') as unknown as T
    default:
      return val as T
  }
}

const AUTH_TOKEN_NAME = 'auth_token'
const REFRESH_TOKEN_NAME = 'refresh_token'
export default {
  notificationsIsEnabled() {
    return parseEnv(import.meta.env.VITE_ENABLE_NOTIFICATIONS || 'false', 'boolean')
  },
  saveTokenInLocalStorage(token: string) {
    localStorage.setItem(AUTH_TOKEN_NAME, token)
  },
  removeTokenFromLocalStorage() {
    localStorage.removeItem(AUTH_TOKEN_NAME)
  },
  getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_NAME)
  },
  saveRefreshTokenInLocalStorage(token: string) {
    localStorage.setItem(REFRESH_TOKEN_NAME, token)
  },
  removeRefreshTokenFromLocalStorage() {
    localStorage.removeItem(REFRESH_TOKEN_NAME)
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_NAME)
  },
  saveBaseUrlInLocalStorage(url: string) {
    localStorage.setItem('default_srv', url)
  },
  baseUrlInLocalStorage(): boolean {
    return parseEnv(import.meta.env.VITE_URLS_FROM_LOCALSTORAGE || 'false', 'boolean')
  },
  getBaseUrl(): string {
    // Если брать url из localstorage, то возвращаем
    // значение по ключу getAuthTokenName из localstorage
    if (this.baseUrlInLocalStorage()) {
      return (
        localStorage.getItem('default_srv')
        || 'BASE_URL_NOT_DEFINED_IN_LOCALSTORAGE'
      )
    }

    return import.meta.env.VITE_BASE_URL || 'BASE_URL_NOT_DEFINED_IN_ENV_FILE'
  },
  BaseUrlIsValid() {
    const url = this.getBaseUrl()
    if (this.baseUrlInLocalStorage()) {
      if (url.includes('BASE_URL_NOT_DEFINED_IN_LOCALSTORAGE')) {
        console.warn('В localstorage не указан сервер')

        return false
      }
    }
    else {
      if (url.includes('BASE_URL_NOT_DEFINED_IN_ENV_FILE')) {
        console.warn('В файле окружения не указан сервер')

        return false
      }
    }

    return true
  },
}
