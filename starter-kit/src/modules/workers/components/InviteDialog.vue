<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h6">
        Приглашение сотрудника
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <v-form ref="formRef" @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <crud-input
                v-model="model.email"
                label="Email сотрудника"
                :disabled="stateProcessing"
                :rules="[rules.required(), rules.email()]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="onCancel">
          Отмена
        </v-btn>
        <crud-button-primary
          label="Пригласить"
          :loading="stateProcessing"
          @click="onSubmit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCrudForm } from '@crudui/providers/useCrudForm'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import { rules } from '@crudui/utils/validation/rules'
import { notifications } from '@crudui/boot/notification'

interface InviteForm {
  email: string
  worker_id: number | string
}

interface Props {
  workerId: number | string
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialog = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const formRef = ref()

const {
  model,
  stateProcessing,
  submit,
  validate,
} = useCrudForm<InviteForm>({
  model: ref({
    email: '',
    worker_id: props.workerId,
  }),
  url: '/workers/invite',
  method: 'post',
  onSuccess: () => {
    notifications.positive('Приглашение успешно отправлено')
    emit('success')
    dialog.value = false
  },
  onError: () => {
    notifications.negative('Ошибка при отправке приглашения')
  },
})

const onSubmit = async () => {
  const isValid = await validate()
  if (!isValid)
    return

  await submit()
}

const onCancel = () => {
  dialog.value = false
}
</script>
