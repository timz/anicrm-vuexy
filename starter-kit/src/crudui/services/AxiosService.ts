import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import envService from '@crudui/services/EnvService'
import { notifications } from '@crudui/boot/notification'
import type { ResponseDto } from '@crudui/interfaces/ResponseDto'
import { useGlobalLoading } from '@crudui/composables/useGlobalLoading'
import { i18n } from '@crudui/boot/i18n'

export const secureApi = getAxiosInstance(true)
export const api = getAxiosInstance(false)

// Флаги и массив подписчиков для синхронизации обновления токена
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

async function refreshToken(): Promise<string> {
  try {
    // Выполняем запрос на обновление токена
    const response = await axios.post(
      `${envService.getBaseUrl()}/auth/refresh-token`,
      {
        token: envService.getRefreshToken(),
      },
    )

    // Предполагается, что новый токен находится в response.data.token
    // "access_token": "42ec3436-9b8d-4e6b-a2f6-7f835e75be23",
    //         "refresh_token": "74cb82e2-3eb6-4872-ae46-fe681a38801d"
    const accessToken = response.data.content.access_token
    const refreshToken = response.data.content.refresh_token

    envService.saveTokenInLocalStorage(accessToken)
    envService.saveRefreshTokenInLocalStorage(refreshToken)

    return accessToken
  }
  catch (error) {
    // notifications.warning(i18n.global.t('errors.sessionExpired'))
    window.location.href = '/#/auth/login'
    window.location.reload()

    throw error
  }
}

export function secureAxios() {
  const instance = axios.create({ baseURL: envService.getBaseUrl() })

  instance.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${envService.getAuthToken()}`

    return config
  })

  return instance
}

function getAxiosInstance(secure = true): AxiosInstance {
  const instance = axios.create({ baseURL: envService.getBaseUrl() })

  // Получаем функции управления загрузкой только для secure instance
  const { startLoading, stopLoading } = secure ? useGlobalLoading() : { startLoading: () => {}, stopLoading: () => {} }

  instance.interceptors.request.use(
    config => {
      config.headers['Accept'] = 'application/json'
      if (secure) {
        config.headers['Authorization'] = `Bearer ${envService.getAuthToken()}`

        // Начинаем глобальную загрузку для защищенных запросов
        startLoading()
      }

      return config
    },
    (error: AxiosError) => {
      if (secure) {
        // Останавливаем загрузку при ошибке запроса
        stopLoading()
      }
      notifications.negative(i18n.global.t('errors.server'))

      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    response => {
      if (secure) {
        // Останавливаем загрузку при успешном ответе
        stopLoading()
      }

      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
      if (error.response) {
        if (error.response.status === 401) {
          // Не пытаемся обновить токен для запросов на логин
          const isLoginRequest = originalRequest.url?.includes('/auth/login')
          if (!originalRequest._retry && !isLoginRequest) {
            // Если другой запрос уже инициировал обновление токена, подписываемся
            if (isRefreshing) {
              return new Promise(resolve => {
                subscribeTokenRefresh(async (token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`
                  }
                  const response = await axios(originalRequest)

                  resolve(response)
                })
              })
            }

            // Если обновление не запущено, запускаем его
            originalRequest._retry = true
            isRefreshing = true
            try {
              const newToken = await refreshToken()

              onRefreshed(newToken)
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
              }

              return await axios(originalRequest)
            }
            catch (refreshError) {
              return Promise.reject(refreshError)
            }
            finally {
              isRefreshing = false
            }
          }
          // Для запроса логина с ошибкой 401 показываем сообщение об ошибке
          else if (isLoginRequest) {
            const data = error.response.data as any
            // Проверяем разные форматы ответа от сервера
            if (data.error) {
              // Формат: {"success":false,"code":401,"error":"Неверный логин или пароль"}
              notifications.warning(data.error)
            }
            else if (data.status && data.status.error) {
              // Формат с вложенным status
              notifications.warning(data.status.error)
            }
            else {
              notifications.warning('Неверный логин или пароль')
            }
          }
        }
        else {
          const data = error.response.data as any
          // Для статуса 422 (валидационные ошибки) и других ошибок показываем сообщение
          if (data.error) {
            // Формат: {"success":false,"code":422,"error":"Сообщение об ошибке"}
            notifications.warning(data.error)
          }
          else if (data.status && data.status.error) {
            // Формат с вложенным status
            notifications.warning(data.status.error)
          }
          else if (error.response.status !== 422) {
            // Для не-валидационных ошибок показываем общее сообщение если нет конкретного
            notifications.warning(i18n.global.t('errors.serverError'))
          }
          // Логируем ошибку для отладки
          if (error.response.status !== 422 || data.error || (data.status && data.status.error)) {
            console.warn(data, 'Ошибка на сервере')
          }
        }
      }
      if (secure) {
        // Останавливаем загрузку при любой ошибке
        stopLoading()
      }

      return Promise.reject(error)
    },
  )

  return instance
}
