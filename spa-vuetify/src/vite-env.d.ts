/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_URLS_FROM_LOCALSTORAGE: string
  readonly VITE_USER_SA_NAME: string
  readonly VITE_USER_SA_PASS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}