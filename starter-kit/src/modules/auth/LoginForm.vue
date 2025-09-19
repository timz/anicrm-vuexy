<template>
  <div>
    <h4 class="text-h4 text-center mb-6 text-blue-grey-darken-2">
      Вход
    </h4>
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <div class="mb-6">
        <crud-input
          v-model="model.username"
          label="Email или имя пользователя"
          :rules="[rules.required(), rules.minLength(2)]"
          :disabled="crudForm.stateProcessing.value"
        />
      </div>
      <div class="mb-6">
        <crud-input
          v-model="model.password"
          label="Пароль"
          type="password"
          :rules="[rules.required(), rules.minLength(6)]"
          :disabled="crudForm.stateProcessing.value"
        />
      </div>
      <div class="d-flex flex-column ga-3">
        <crud-button-primary
          size="large"
          block
          :loading="crudForm.stateProcessing.value"
          @click="onSubmit"
        >
          Войти
        </crud-button-primary>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="navigateResetForm"
        >
          Забыли пароль?
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { rules } from '@crudui/utils/rules'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import envService from '@crudui/services/EnvService'
import { notifications } from '@crudui/boot/notification'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import { type QFormConfig, useCrudForm } from '@crudui/providers/useCrudForm'
import type { FormModel } from '@crudui/types'

const emits = defineEmits(['goResetForm'])

const router = useRouter()

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
    const content = result.content

    envService.saveTokenInLocalStorage(content.access_token)
    envService.saveRefreshTokenInLocalStorage(content.refresh_token)
    notifications.positive('Добро пожаловать!')
    await router.push({ name: 'home' })
  }
  catch (error) {
    // Ошибки обрабатываются в AxiosService interceptors
    // Здесь можем добавить специфичную для логина логику, если нужно
    console.warn('Login failed:', error)
  }
}
</script>
