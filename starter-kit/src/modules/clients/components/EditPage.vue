<template>
  <PageTitle>{{ $t('modules.clients.single') }}</PageTitle>
  <CrudEditForm :tabs="tabs">
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.name"
          :label="$t('modules.clients.form.name')"
          :disable="stateProcessing"
          :rules="[rules.required(), rules.minLength(3), rules.maxLength(100)]"
        />
      </v-col>
      <v-col cols="12">
        <crud-input v-model="model.mobile" :label="$t('modules.clients.form.mobile')" :disable="stateProcessing" />
      </v-col>
      <v-col cols="12">
        <crud-date-picker v-model="model.birthday" :label="$t('modules.clients.form.birthday')" />
      </v-col>
      <v-col cols="12">
        <CrudSelector
          v-model="model.adv_id"
          data-url="/adv-sources/list"
          :label="$t('modules.clients.form.advSource')"
        />
      </v-col>
      <v-col cols="12">
        <crud-input v-model="model.description" type="textarea" :label="$t('modules.clients.form.description')" :disable="stateProcessing" />
      </v-col>
    </template>
  </CrudEditForm>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ClientKidsIndexPage from '../../client-kids/components/IndexPage.vue'
import CrudEditForm from '@crudui/components/forms/CrudEditForm.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'
import CrudSelector from '@crudui/components/Inputs/CrudSelector.vue'
import { useCrudEditPage } from '@crudui/providers/useCrudEditPage'
import type { FormModel } from '@crudui/types'
import type { CrudTabInterface } from '@crudui/components/forms/tabs/TabTypes'
import { TabVisibilityHelpers } from '@crudui/components/forms/tabs/TabHelpers'
import { rules } from '@crudui/utils/validation/rules'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface ClientItem extends FormModel {
  name: string
  mobile: string
  description: string
  birthday: string | null
  start_on: string | null
  test_time: string | null
  adv_id: number | null
}

// Инициализация i18n
const { t } = useI18n()

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
    adv_id: null,
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
    label: t('modules.clients.tabs.clientKids'),
    icon: 'mdi-account-child',
    tab: ClientKidsIndexPage,
    visible: TabVisibilityHelpers.hideOnNew,
  },
  {
    name: 'client-kids2',
    label: t('modules.clients.tabs.clientKids') + ' sda',
    icon: 'mdi-account-child',
    tab: ClientKidsIndexPage,
    visible: TabVisibilityHelpers.hideOnNew,
  },
]
const titleRules = [
  (val: string) => !!val || t('modules.clients.validation.nameRequired'),
  (val: string) => val.length >= 2 || t('modules.clients.validation.nameMinLength'),
]
</script>
