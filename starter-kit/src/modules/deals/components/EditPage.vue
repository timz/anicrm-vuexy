<template>
  <PageTitle>Сделка</PageTitle>

  <CrudEditForm>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          label="Название сделки"
          :disabled="stateProcessing"
          :rules="[rules.required(), rules.minLength(3), rules.maxLength(255)]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.client_id"
          data-url="/clients/list"
          label="Клиент"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.status"
          :items="statusOptions"
          label="Статус"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <crud-input
          v-model="model.amount"
          label="Сумма"
          type="number"
          :disabled="stateProcessing"
          :rules="[rules.required(), rules.numberMin(0)]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.currency"
          :items="currencyOptions"
          label="Валюта"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <crud-date-picker
          v-model="model.start_date"
          label="Дата начала"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <crud-date-picker
          v-model="model.close_date"
          label="Дата закрытия"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.stage"
          :items="stageOptions"
          label="Этап"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <crud-input
          v-model="model.probability"
          label="Вероятность закрытия (%)"
          type="number"
          :disabled="stateProcessing"
          :rules="[rules.numberMin(0), rules.numberMax(100)]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.source"
          :items="sourceOptions"
          label="Источник"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.responsible_id"
          data-url="/workers/list"
          label="Ответственный"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="12">
        <crud-input
          v-model="model.description"
          type="textarea"
          label="Описание"
          :disabled="stateProcessing"
          :rules="[rules.maxLength(2000)]"
        />
      </v-col>

      <v-col cols="12">
        <crud-input
          v-model="model.notes"
          type="textarea"
          label="Заметки"
          :disabled="stateProcessing"
          :rules="[rules.maxLength(1000)]"
        />
      </v-col>
    </template>
  </CrudEditForm>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import CrudEditForm from '@crudui/components/forms/CrudEditForm.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'
import CrudSelector from '@crudui/components/Inputs/CrudSelector.vue'
import { useCrudEditPage } from '@crudui/providers/useCrudEditPage'
import type { FormModel } from '@crudui/types'
import { rules } from '@crudui/utils/validation/rules'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface DealItem extends FormModel {
  title: string
  client_id: number | null
  status: string
  amount: number
  currency: string
  start_date: string | null
  close_date: string | null
  stage: string
  probability: number
  source: string | null
  responsible_id: number | null
  description: string
  notes: string
}

// Конфигурация формы через композицию блоков
const editFormConfig = {
  model: ref({
    id: null,
    title: '',
    client_id: null,
    status: 'new',
    amount: 0,
    currency: 'RUB',
    start_date: null,
    close_date: null,
    stage: 'lead',
    probability: 0,
    source: null,
    responsible_id: null,
    description: '',
    notes: '',
  }),
  prefixUrl: '/deals',
  backRoute: { name: 'dealsIndex' },
}

// Создаем провайдер
const editPageProvider = useCrudEditPage<DealItem>(editFormConfig)

const model = editPageProvider.model

// Предоставляем провайдер
provide('editPageProvider', editPageProvider)

// Опции для селекторов
const statusOptions = [
  { value: 'new', title: 'Новая' },
  { value: 'in_progress', title: 'В работе' },
  { value: 'won', title: 'Выиграна' },
  { value: 'lost', title: 'Проиграна' },
  { value: 'on_hold', title: 'На удержании' },
]

const currencyOptions = [
  { value: 'RUB', title: 'Рубль' },
  { value: 'USD', title: 'Доллар США' },
  { value: 'EUR', title: 'Евро' },
]

const stageOptions = [
  { value: 'lead', title: 'Лид' },
  { value: 'contact', title: 'Контакт' },
  { value: 'qualification', title: 'Квалификация' },
  { value: 'proposal', title: 'Предложение' },
  { value: 'negotiation', title: 'Переговоры' },
  { value: 'contract', title: 'Договор' },
  { value: 'closed', title: 'Закрыта' },
]

const sourceOptions = [
  { value: 'website', title: 'Веб-сайт' },
  { value: 'phone', title: 'Телефон' },
  { value: 'email', title: 'Email' },
  { value: 'social', title: 'Социальные сети' },
  { value: 'referral', title: 'Рекомендация' },
  { value: 'advertising', title: 'Реклама' },
  { value: 'partner', title: 'Партнер' },
  { value: 'other', title: 'Другое' },
]
</script>