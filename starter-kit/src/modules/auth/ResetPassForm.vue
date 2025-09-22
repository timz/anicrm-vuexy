<template>
  <div>
    <div class="text-h5 font-weight-medium text-center mb-6 text-medium-emphasis">
      {{ $t('auth.resetPassword') }}
    </div>
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <div class="mb-6">
        <crud-input
          v-model="model.email"
          :label="$t('auth.email')"
          type="email"
          :rules="[rules.required(), rules.email(), rules.minLength(5)]"
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
          {{ $t('auth.resetButton') }}
        </crud-button-primary>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="navigateLoginForm"
        >
          ← {{ $t('auth.backToLogin') }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { rules } from '@crudui/utils/validation/rules'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import { useCrudForm } from '@crudui/providers/useCrudForm'
import { notifications } from '@crudui/boot/notification'

const emits = defineEmits(['goLoginForm'])

const model = ref({
  email: '',
})

const crudForm = useCrudForm({
  url: '/auth/reset-password',
  model,
  isSecure: false,
})

const formRef = crudForm.formRef
function navigateLoginForm() {
  emits('goLoginForm')
}

const onSubmit = async (): Promise<void> => {
  await crudForm.submit()
  notifications.positive('На указанный email выслано письмо с инструкциями по восстановлению пароля')
}
</script>
