<template>
  <div>
    <div class="text-h5 font-weight-medium text-center mb-6 text-medium-emphasis">
      Восстановление пароля
    </div>
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <div class="mb-6">
        <crud-input
          v-model="model.email"
          label="Email учетной записи"
          type="email"
          :rules="[r.required(), r.email(), r.strMinLength(5)]"
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
          Отправить инструкции
        </crud-button-primary>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="navigateLoginForm"
        >
          ← Вернуться к входу
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import r from '@crudui/services/RulesService'
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
