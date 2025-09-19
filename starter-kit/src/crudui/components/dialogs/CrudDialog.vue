<template>
  <v-dialog
    v-model="dialogProvider.isOpen.value"
    persistent
    max-width="480px"
  >
    <v-card>
      <v-card-title class="bg-blue-grey-darken-3 text-blue-grey-lighten-4">
        {{
          dialogProvider.isCreateMode.value
            ? "Создание записи"
            : "Редактирование записи"
        }}
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-row class="v-row-form">
            <slot
              :model="model"
              :is-create-mode="dialogProvider.isCreateMode.value"
              :state-processing="stateProcessing"
              :form-ref="formRef"
            />
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pt-0 px-5 pb-5 ga-2">
        <v-spacer />
        <crud-button-secondary @click="dialogProvider.closeDialog">
          Закрыть
        </crud-button-secondary>
        <crud-button-primary :loading="stateProcessing" @click="handleSubmit">
          {{ dialogProvider.isCreateMode.value ? "Создать" : "Сохранить" }}
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
const loading = ref(false)

const {
  stateProcessing,
  stateSubmitting,
  stateLoading,
  formRef,
  model,
  load,
  submit,
  reset,
} = useCrudDataForm(dialogProvider.formConfig)

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

        dialogProvider.formConfig.model.value[primaryKey] =
          dialogProvider.editId.value
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
  const { valid } = await formRef.value?.validate()
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
