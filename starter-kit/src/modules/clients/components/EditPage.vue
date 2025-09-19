<template>
  <PageTitle>Клиент</PageTitle>
  <CrudEditForm :tabs="tabs">
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.name"
          label="Название"
          :disable="stateProcessing"
          :rules="[r.required(), r.strMinLength(3), r.strMaxLength(100)]"
        />
      </v-col>
      <v-col cols="12">
        <crud-input v-model="model.mobile" label="Мобильный" :disable="stateProcessing" />
      </v-col>
      <v-col cols="6">
        <crud-date-picker v-model="model.birthday" label="Дата рождения" />
      </v-col>
      <v-col cols="6">
        <crud-input v-model="model.start_on" label="Начало" :disable="stateProcessing" />
      </v-col>
      <v-col cols="12">
        <crud-input v-model="model.description" type="textarea" label="Заметки" :disable="stateProcessing" />
      </v-col>
    </template>
  </CrudEditForm>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import ClientKidsIndexPage from '../../client-kids/components/IndexPage.vue'
import CrudEditForm from '@crudui/components/forms/CrudEditForm.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'
import { useCrudEditPage } from '@crudui/providers/useCrudEditPage'
import type { FormModel } from '@crudui/types'
import type { CrudTabInterface } from '@crudui/components/forms/tabs/TabTypes'
import { TabVisibilityHelpers } from '@crudui/components/forms/tabs/TabHelpers'
import r from '@crudui/services/RulesService'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface ClientItem extends FormModel {
  name: string
  mobile: string
  description: string
  birthday: string | null
  start_on: string | null
  test_time: string | null
}

// Конфигурация формы через композицию блоков
const editFormConfig = {
  model: ref({
    id: null,
    name: '',
    mobile: '',
    description: '',
    birthday: null,
    start_on: null,
    test_time: null,
  }),
  prefixUrl: '/clients',
  backRoute: { name: 'clientsIndex' },
}

// Создаем провайдер
const editPageProvider = useCrudEditPage<ClientItem>(editFormConfig)

const model = editPageProvider.model

// Предоставляем провайдер
provide('editPageProvider', editPageProvider)

// Конфигурация табов
const tabs: CrudTabInterface[] = [
  {
    name: 'client-kids',
    label: 'Дети клиента',
    icon: 'mdi-account-child',
    tab: ClientKidsIndexPage,
    visible: TabVisibilityHelpers.hideOnNew,
  },
]

// Правила валидации
const titleRules = [
  (val: string) => !!val || 'Название обязательно',
  (val: string) => val.length >= 2 || 'Минимум 2 символа',
]
</script>
