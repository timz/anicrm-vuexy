<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VNodeRenderer } from '@crudui/components/templates/helpers/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { api } from '@crudui/services/AxiosService'
import envService from '@crudui/services/EnvService'
import { notifications } from '@crudui/boot/notification'
import { saveAbilityRules } from '@/crudui/plugins/casl/index'
import { ability } from '@/crudui/plugins/casl/ability'

const router = useRouter()
const { t } = useI18n()

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

    notifications.positive(t('auth.welcomeMessage'))
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
    notifications.positive(t('auth.resetEmailSent'))
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
            {{ $t('auth.title') }}
          </h4>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.username"
                  autofocus
                  :label="$t('auth.emailOrUsername')"
                  placeholder="johndoe@email.com"
                  :disabled="isLoading"
                  :rules="[
                    (v: string) => !!v || t('validation.required'),
                    (v: string) => v.length >= 2 || t('validation.minChars2'),
                  ]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  :label="$t('auth.password')"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :disabled="isLoading"
                  :rules="[
                    (v: string) => !!v || t('validation.required'),
                    (v: string) => v.length >= 6 || t('validation.minChars6'),
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
                    {{ $t('auth.loginButton') }}
                  </VBtn>

                  <!-- forgot password -->
                  <VBtn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showResetForm = true"
                  >
                    {{ $t('auth.forgotPassword') }}
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </div>

        <div v-else>
          <h5 class="text-h5 text-center mb-6">
            {{ $t('auth.resetPassword') }}
          </h5>
          <VForm @submit.prevent="onResetPassword">
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="resetEmail"
                  :label="$t('auth.accountEmail')"
                  type="email"
                  placeholder="johndoe@email.com"
                  :disabled="isLoading"
                  :rules="[
                    (v: string) => !!v || t('validation.required'),
                    (v: string) => /.+@.+\..+/.test(v) || t('validation.emailValid'),
                    (v: string) => v.length >= 5 || t('validation.minChars5'),
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
                    {{ $t('auth.sendInstructions') }}
                  </VBtn>

                  <VBtn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showResetForm = false; resetEmail = ''"
                  >
                    {{ $t('auth.backToLogin2') }}
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
