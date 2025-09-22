<template>
  <v-dialog v-model="dialogProvider.isOpen.value" persistent max-width="480px">
    <v-card class="pa-3">
      <div class="px-3">
        <div class="pb-4 text-h4 font-weight-bold text-secondary">
          {{ dialogProvider.isCreateMode.value ? $t('common.dialog.createTitle') : $t('common.dialog.editTitle') }}
        </div>

        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-row class="form-row">
            <slot
              :model="model"
              :is-create-mode="dialogProvider.isCreateMode.value"
              :state-processing="stateProcessing"
              :form-ref="formRef"
            />
          </v-row>
        </v-form>
      </div>
      <v-card-actions class="ga-2 pt-6">
        <v-spacer />
        <crud-button-secondary @click="dialogProvider.closeDialog">
          {{ $t('common.close') }}
        </crud-button-secondary>
        <crud-button-primary :loading="stateProcessing" @click="handleSubmit">
          {{ dialogProvider.isCreateMode.value ? $t('common.create') : $t('common.save') }}
        </crud-button-primary>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useCrudDataForm } from '@crudui/providers/useCrudDataForm'
import type { CrudDialogProviderReturn } from '@crudui/providers/useCrudDialogProvider'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'

interface Props {
  providerKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  providerKey: 'dialogProvider',
})

const dialogProvider = inject<CrudDialogProviderReturn>(props.providerKey)

if (!dialogProvider) {
  throw new Error(`Dialog provider with key '${props.providerKey}' not found. Make sure it's provided.`)
}

const loading = ref(false)

const { stateProcessing, stateSubmitting, stateLoading, formRef, model, load, submit, reset } = useCrudDataForm(
  dialogProvider.formConfig,
)

// Управляем состоянием загрузки
watch([stateLoading, stateSubmitting], ([loadingState, submittingState]) => {
  loading.value = loadingState || submittingState
})

// Загружаем данные при открытии диалога
watch(
  () => dialogProvider.isOpen.value,
  async isOpen => {
    if (isOpen) {
      if (dialogProvider.editId.value === null) {
        // Режим создания - полностью очищаем модель
        dialogProvider.formConfig.model.value = {} as any
      }
      else {
        // Режим редактирования - загружаем данные
        const primaryKey = dialogProvider.formConfig.primaryKey ?? 'id'

        dialogProvider.formConfig.model.value[primaryKey] = dialogProvider.editId.value
        await load()
      }
    }
    else {
      // При закрытии сбрасываем только валидацию
      formRef.value?.resetValidation()
    }
  },
)

const handleSubmit = async (): Promise<void> => {
  // Сначала явно проверяем валидацию формы
  const validation = await formRef.value?.validate()
  const valid = validation?.valid ?? false
  if (!valid) {
    // Если валидация не прошла, прерываем выполнение
    // Ошибки валидации уже отображены в полях формы
    return
  }

  try {
    await submit()

    if (dialogProvider.isCreateMode.value) {
      // При создании - переключаемся в режим редактирования с новым ID
      const primaryKey = dialogProvider.formConfig.primaryKey ?? 'id'
      const newId = model.value[primaryKey] as string | number

      dialogProvider.editId.value = newId
    }

    // Отмечаем что данные были сохранены
    dialogProvider.wasSaved.value = true
  }
  catch (error) {
    console.error('Ошибка сохранения:', error)
  }
}
</script>
