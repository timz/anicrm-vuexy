<template>
  <PageTitle>Сотрудник</PageTitle>

  <CrudEditForm>
    <template #actions>
      <crud-button-secondary prepend-icon="mdi-email" @click="showInviteDialog">
        Пригласить
      </crud-button-secondary>
    </template>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.name"
          label="Имя"
          :disabled="stateProcessing"
          :rules="[rules.required(), rules.minLength(1), rules.maxLength(255)]"
        />
      </v-col>
      <v-col cols="6">
        <crud-input
          v-model="model.mobile"
          label="Мобильный телефон"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>
      <v-col cols="6">
        <crud-date-picker v-model="model.birthday" label="Дата рождения" :disabled="stateProcessing" />
      </v-col>
      <v-col cols="6">
        <crud-date-picker v-model="model.med_book" label="Медицинская книжка" :disabled="stateProcessing" />
      </v-col>
      <v-col cols="6">
        <crud-date-picker v-model="model.sud_sprav" label="Судебная справка" :disabled="stateProcessing" />
      </v-col>
      <v-col cols="12">
        <crud-input
          v-model="model.description"
          type="textarea"
          label="Описание"
          :disabled="stateProcessing"
          :rules="[rules.maxLength(1000)]"
        />
      </v-col>
    </template>
  </CrudEditForm>

  <InviteDialog v-model="inviteDialogVisible" :worker-id="model.id" @success="onInviteSuccess" />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import InviteDialog from './InviteDialog.vue'
import CrudEditForm from '@crudui/components/forms/CrudEditForm.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'
import { useCrudEditPage } from '@crudui/providers/useCrudEditPage'
import type { FormModel } from '@crudui/types'
import { rules } from '@crudui/utils/validation/rules'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface WorkerItem extends FormModel {
  name: string
  mobile: string
  birthday: string | null
  description: string
  med_book: string
  sud_sprav: string
}

const editFormConfig = {
  model: ref({
    id: null,
    name: '',
    mobile: '',
    birthday: null,
    description: '',
    med_book: '',
    sud_sprav: '',
  }),
  prefixUrl: '/workers',
  backRoute: { name: 'workersIndex' },
}

const editPageProvider = useCrudEditPage<WorkerItem>(editFormConfig)

const model = editPageProvider.model

provide('editPageProvider', editPageProvider)

const inviteDialogVisible = ref(false)

const showInviteDialog = () => {
  inviteDialogVisible.value = true
}

const onInviteSuccess = () => {
  inviteDialogVisible.value = false
}
</script>
