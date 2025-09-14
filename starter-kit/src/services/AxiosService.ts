import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios'
import envService from '@/services/EnvService'
import { notifications } from '@/services/notification'
import type { ResponseDto } from '@/interfaces/ResponseDto'
import { useGlobalLoading } from '@/composables/useGlobalLoading'

export const secureApi = getAxiosInstance(true)
export const api = getAxiosInstance(false)

// Флаги и массив подписчиков для синхронизации обновления токена
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

async function refreshToken(): Promise<string> {
  try {
    // Выполняем запрос на обновление токена
    const response = await axios.post(
      envService.getBaseUrl() + '/auth/refresh-token',
      {
        'token': envService.getRefreshToken()
      }
    )
    // Предполагается, что новый токен находится в response.data.token
    // "access_token": "42ec3436-9b8d-4e6b-a2f6-7f835e75be23",
    //         "refresh_token": "74cb82e2-3eb6-4872-ae46-fe681a38801d"
    const accessToken = response.data.content.access_token
    const refreshToken = response.data.content.refresh_token
    envService.saveTokenInLocalStorage(accessToken)
    envService.saveRefreshTokenInLocalStorage(refreshToken)
    return accessToken
  } catch (error) {
    // notifications.warning('Ваша сессия авторизации устарела. Авторизуйтесь повторно')
    window.location.href = '/#/auth/login'
    window.location.reload()

    throw error
  }
}

export function secureAxios() {
  const instance = axios.create({ baseURL: envService.getBaseUrl() })
  instance.interceptors.request.use((config) => {
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
    (config) => {
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
      notifications.negative('Ошибка при обращении к серверу')
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response) => {
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
          if (!originalRequest._retry) {
            // Если другой запрос уже инициировал обновление токена, подписываемся
            if (isRefreshing) {
              return new Promise((resolve) => {
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                subscribeTokenRefresh(async (token: string) => {
                  if (originalRequest.headers){
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
              if (originalRequest.headers){
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
              }
              return await axios(originalRequest)
            } catch (refreshError) {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              return Promise.reject(refreshError)
            } finally {
              isRefreshing = false
            }
          }
        } else if (error.response.status !== 422) {
          const data = error.response.data as ResponseDto
          if (data.status && data.status.error) {
            notifications.warning(data.status.error)
          } else {
            notifications.warning('Ошибка на сервере. Обратитесь в поддержку')
          }
          console.warn(data, 'Ошибка на сервере')
        }
      }
      if (secure) {
        // Останавливаем загрузку при любой ошибке
        stopLoading()
      }
      return Promise.reject(error)
    }
  )

  return instance
}