<script setup lang="ts">
import { useRouter } from 'vue-router'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { api } from '@crud/services/AxiosService'
import envService from '@crud/services/EnvService'
import { notifications } from '@crud/boot/notification'
import { saveAbilityRules } from '@/crudui/plugins/casl'
import { ability } from '@/crudui/plugins/casl/ability'

const router = useRouter()

definePage({
  meta: {
    layout: 'clean',
    public: true,
  },
})

interface LoginModel {
  username: string
  password: string
  platform: string
}

const form = ref<LoginModel>({
  username: import.meta.env.VITE_USER_SA_NAME || '',
  password: import.meta.env.VITE_USER_SA_PASS || '',
  platform: 'app',
})

const isPasswordVisible = ref(false)
const isLoading = ref(false)
const showResetForm = ref(false)
const resetEmail = ref('')

const onSubmit = async (): Promise<void> => {
  try {
    isLoading.value = true

    const response = await api.post('/auth/login', form.value)
    const content = response.data.content

    // Сохраняем токены
    envService.saveTokenInLocalStorage(content.access_token)
    envService.saveRefreshTokenInLocalStorage(content.refresh_token)

    // Сохраняем CASL правила (если они пришли с сервера)
    if (content.ability_rules) {
      saveAbilityRules(content.ability_rules)
      ability.update(content.ability_rules)
    }
    else {
      // Если правила не пришли, создаем базовые правила для тестирования
      const defaultRules = [
        { action: 'manage', subject: 'all' }, // Полный доступ для разработки
      ]

      saveAbilityRules(defaultRules)
      ability.update(defaultRules)
    }

    notifications.positive('Добро пожаловать!')
    await router.push('/')
  }
  catch (error: any) {
    // Ошибки обрабатываются в AxiosService interceptors
    console.warn('Login failed:', error)
  }
  finally {
    isLoading.value = false
  }
}

const onResetPassword = async (): Promise<void> => {
  try {
    isLoading.value = true
    await api.post('/auth/reset-password', { email: resetEmail.value })
    notifications.positive('На указанный email выслано письмо с инструкциями по восстановлению пароля')
    showResetForm.value = false
    resetEmail.value = ''
  }
  catch (error: any) {
    console.warn('Reset password failed:', error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- 👉 Auth Card -->
  <VCard
    class="auth-card"
    max-width="460"
    :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
  >
    <VCardItem class="justify-center">
      <VCardTitle>
        <RouterLink to="/">
          <div class="app-logo">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </div>
        </RouterLink>
      </VCardTitle>
    </VCardItem>

    <VCardText>
      <VExpandTransition mode="out-in">
        <div v-if="!showResetForm">
          <h4 class="text-h4 text-center mb-6">
            Вход
          </h4>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.username"
                  autofocus
                  label="Email или имя пользователя"
                  placeholder="johndoe@email.com"
                  :disabled="isLoading"
                  :rules="[
                    (v: string) => !!v || 'Обязательное поле',
                    (v: string) => v.length >= 2 || 'Минимум 2 символа',
                  ]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Пароль"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :disabled="isLoading"
                  :rules="[
                    (v: string) => !!v || 'Обязательное поле',
                    (v: string) => v.length >= 6 || 'Минимум 6 символов',
                  ]"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-column ga-3">
                  <!-- login button -->
                  <VBtn
                    block
                    type="submit"
                    size="large"
                    :loading="isLoading"
                  >
                    Войти
                  </VBtn>

                  <!-- forgot password -->
                  <VBtn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showResetForm = true"
                  >
                    Забыли пароль?
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </div>

        <div v-else>
          <h5 class="text-h5 text-center mb-6">
            Восстановление пароля
          </h5>
          <VForm @submit.prevent="onResetPassword">
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="resetEmail"
                  label="Email учетной записи"
                  type="email"
                  placeholder="johndoe@email.com"
                  :disabled="isLoading"
                  :rules="[
                    (v: string) => !!v || 'Обязательное поле',
                    (v: string) => /.+@.+\..+/.test(v) || 'Email должен быть корректным',
                    (v: string) => v.length >= 5 || 'Минимум 5 символов',
                  ]"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-column ga-3">
                  <VBtn
                    block
                    type="submit"
                    size="large"
                    :loading="isLoading"
                  >
                    Отправить инструкции
                  </VBtn>

                  <VBtn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showResetForm = false; resetEmail = ''"
                  >
                    ← Вернуться к входу
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </div>
      </VExpandTransition>
    </VCardText>
  </VCard>
</template>
