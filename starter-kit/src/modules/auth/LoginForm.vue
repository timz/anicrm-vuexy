<template>
  <div style="min-width: 280px;">
    <h4 class="text-h4 text-center mb-6 text-blue-grey-darken-2">
      {{ $t('auth.title') }}
    </h4>
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <v-row  class="form-row">
        <v-col cols="12">
          <crud-input
            v-model="model.username"
            :label="$t('auth.username')"
            :rules="[rules.required(), rules.minLength(2)]"
            :disabled="crudForm.stateProcessing.value"
          />
        </v-col>
        <v-col cols="12">
          <crud-input
            v-model="model.password"
            :label="$t('auth.password')"
            type="password"
            :rules="[rules.required(), rules.minLength(6)]"
            :disabled="crudForm.stateProcessing.value"
          />
        </v-col>
        <v-col cols="12 mt-2">
          <div class="d-flex flex-column ga-3">
            <crud-button-primary
              block
              :loading="crudForm.stateProcessing.value"
              @click="onSubmit"
            >
              {{ $t('auth.loginButton') }}
            </crud-button-primary>
            <v-btn
              variant="text"
              color="primary"
              @click="navigateResetForm"
            >
              {{ $t('auth.forgotPassword') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>

    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { rules } from '@crudui/utils/validation/rules'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import envService from '@crudui/services/EnvService'
import { notifications } from '@crudui/boot/notification'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import { type QFormConfig, useCrudForm } from '@crudui/providers/useCrudForm'
import type { FormModel } from '@crudui/types'

const emits = defineEmits(['goResetForm'])

const router = useRouter()
const { t } = useI18n()

interface LoginModel extends FormModel {
  username: string
  password: string
  platform: string
}

const model = ref<LoginModel>({
  username: import.meta.env.VITE_USER_SA_NAME || '',
  password: import.meta.env.VITE_USER_SA_PASS || '',
  platform: 'app',
})

const crudForm = useCrudForm({
  requestKey: false,
  url: '/auth/login',
  model,
  isSecure: false,
} as QFormConfig<LoginModel>)

const formRef = crudForm.formRef

function navigateResetForm() {
  emits('goResetForm')
}

const onSubmit = async (): Promise<void> => {
  try {
    const result = await crudForm.submit()

    // Проверяем что получили успешный ответ с токенами
    if (result?.content?.access_token && result?.content?.refresh_token) {
      const content = result.content

      envService.saveTokenInLocalStorage(content.access_token)
      envService.saveRefreshTokenInLocalStorage(content.refresh_token)
      notifications.positive(t('auth.welcomeMessage'))
      await router.push({ name: 'home' })
    }
  }
  catch (error) {
    // Ошибки уже обработаны в AxiosService interceptors и показаны через notifications
    // Просто логируем для отладки
    console.warn('Login failed:', error)
  }
}
</script>
