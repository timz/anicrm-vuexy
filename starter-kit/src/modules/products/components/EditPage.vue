<template>
  <PageTitle>{{ $t('modules.products.single') }}</PageTitle>

  <CrudEditForm>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          :label="$t('modules.products.fields.title')"
          :disabled="stateProcessing"
          :rules="[rules.required(), rules.minLength(1), rules.maxLength(255)]"
        />
      </v-col>
      <v-col cols="12">
        <CrudSelector
          v-model="model.measure_id"
          data-url="/measures/list"
          :label="$t('modules.products.fields.measure')"
          :disabled="stateProcessing"
        />
      </v-col>
      <v-col cols="12">
        <crud-input
          v-model="model.description"
          type="textarea"
          :label="$t('modules.products.fields.description')"
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
import CrudSelector from '@crudui/components/Inputs/CrudSelector.vue'
import { useCrudEditPage } from '@crudui/providers/useCrudEditPage'
import type { FormModel } from '@crudui/types'
import { rules } from '@crudui/utils/validation/rules'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface ProductItem extends FormModel {
  title: string
  measure_id: number | null
  description: string | null
}

const editFormConfig = {
  model: ref({
    id: null,
    title: '',
    measure_id: null,
    description: null,
  }),
  prefixUrl: '/products',
  backRoute: { name: 'productsIndex' },
}

const editPageProvider = useCrudEditPage<ProductItem>(editFormConfig)

const model = editPageProvider.model

provide('editPageProvider', editPageProvider)
</script>
