<template>
  <PageTitle>{{ $t('modules.deals.single') }}</PageTitle>

  <CrudEditForm>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          :label="$t('modules.deals.fields.title')"
          :disabled="stateProcessing"
          :rules="[rules.required(), rules.minLength(3), rules.maxLength(255)]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.client_id"
          data-url="/clients/list"
          :label="$t('modules.deals.fields.client')"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.status"
          :items="statusOptions"
          :label="$t('modules.deals.fields.status')"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <crud-money
          v-model="model.amount"
          :label="$t('modules.deals.fields.amount')"
          :disabled="stateProcessing"
          :rules="[rules.required(), rules.numberMin(0)]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.currency"
          :items="currencyOptions"
          :label="$t('modules.deals.fields.currency')"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <crud-date-picker
          v-model="model.start_date"
          :label="$t('modules.deals.fields.startDate')"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <crud-date-picker
          v-model="model.close_date"
          :label="$t('modules.deals.fields.closeDate')"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.stage"
          :items="stageOptions"
          :label="$t('modules.deals.fields.stage')"
          :disabled="stateProcessing"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="6">
        <crud-input
          v-model="model.probability"
          :label="$t('modules.deals.fields.probability')"
          type="number"
          :disabled="stateProcessing"
          :rules="[rules.numberMin(0), rules.numberMax(100)]"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.source"
          :items="sourceOptions"
          :label="$t('modules.deals.fields.source')"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <CrudSelector
          v-model="model.responsible_id"
          data-url="/workers/list"
          :label="$t('modules.deals.fields.responsible')"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="12">
        <crud-input
          v-model="model.description"
          type="textarea"
          :label="$t('modules.deals.fields.description')"
          :disabled="stateProcessing"
          :rules="[rules.maxLength(2000)]"
        />
      </v-col>

      <v-col cols="12">
        <crud-input
          v-model="model.notes"
          type="textarea"
          :label="$t('modules.deals.fields.notes')"
          :disabled="stateProcessing"
          :rules="[rules.maxLength(1000)]"
        />
      </v-col>
    </template>
  </CrudEditForm>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CrudEditForm from '@crudui/components/forms/CrudEditForm.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudMoney from '@crudui/components/Inputs/CrudMoney.vue'
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
const { t } = useI18n()

const statusOptions = [
  { value: 'new', title: t('modules.deals.statusesEdit.new') },
  { value: 'in_progress', title: t('modules.deals.statusesEdit.inProgress') },
  { value: 'won', title: t('modules.deals.statusesEdit.won') },
  { value: 'lost', title: t('modules.deals.statusesEdit.lost') },
  { value: 'on_hold', title: t('modules.deals.statusesEdit.onHold') },
]

const currencyOptions = [
  { value: 'RUB', title: t('modules.deals.currencies.rub') },
  { value: 'USD', title: t('modules.deals.currencies.usd') },
  { value: 'EUR', title: t('modules.deals.currencies.eur') },
]

const stageOptions = [
  { value: 'lead', title: t('modules.deals.stages.lead') },
  { value: 'contact', title: t('modules.deals.stages.contact') },
  { value: 'qualification', title: t('modules.deals.stages.qualification') },
  { value: 'proposal', title: t('modules.deals.stages.proposal') },
  { value: 'negotiation', title: t('modules.deals.stages.negotiation') },
  { value: 'contract', title: t('modules.deals.stages.contract') },
  { value: 'closed', title: t('modules.deals.stages.closed') },
]

const sourceOptions = [
  { value: 'website', title: t('modules.deals.sources.website') },
  { value: 'phone', title: t('modules.deals.sources.phone') },
  { value: 'email', title: t('modules.deals.sources.email') },
  { value: 'social', title: t('modules.deals.sources.social') },
  { value: 'referral', title: t('modules.deals.sources.referral') },
  { value: 'advertising', title: t('modules.deals.sources.advertising') },
  { value: 'partner', title: t('modules.deals.sources.partner') },
  { value: 'other', title: t('modules.deals.sources.other') },
]
</script>
