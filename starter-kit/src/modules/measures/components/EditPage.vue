<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <h1 class="text-h4">
              {{ $t('modules.measures.edit.title') }}
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveMeasure">
              <v-row>
                <v-col cols="12" md="6">
                  <crud-input
                    v-model="measure.title"
                    :label="$t('modules.measures.form.title')"
                    :placeholder="$t('modules.measures.form.titlePlaceholder')"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <crud-input
                    v-model="measure.shortName"
                    :label="$t('modules.measures.form.shortName')"
                    :placeholder="$t('modules.measures.form.shortNamePlaceholder')"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <crud-select
                    v-model="measure.type"
                    :label="$t('modules.measures.form.type')"
                    :items="measureTypes"
                    item-title="text"
                    item-value="value"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <crud-input
                    v-model="measure.coefficient"
                    :label="$t('modules.measures.form.coefficient')"
                    type="number"
                    :placeholder="$t('modules.measures.form.coefficientPlaceholder')"
                  />
                </v-col>
                <v-col cols="12">
                  <crud-input
                    v-model="measure.description"
                    :label="$t('modules.measures.form.description')"
                    type="textarea"
                    :placeholder="$t('modules.measures.form.descriptionPlaceholder')"
                  />
                </v-col>
                <v-col cols="12">
                  <crud-checkbox
                    v-model="measure.isActive"
                    :label="$t('modules.measures.form.isActive')"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex ga-2">
                <crud-button-primary type="submit">
                  {{ $t('save') }}
                </crud-button-primary>
                <crud-button-secondary @click="$router.go(-1)">
                  {{ $t('cancel') }}
                </crud-button-secondary>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudSelect from '@crudui/components/Inputs/CrudSelect.vue'
import CrudCheckbox from '@crudui/components/Inputs/CrudCheckbox.vue'

const { t } = useI18n()

const measure = ref({
  title: '',
  shortName: '',
  type: null,
  coefficient: 1.0,
  description: '',
  isActive: true,
})

const measureTypes = computed(() => [
  { text: t('modules.measures.types.weight'), value: 'weight' },
  { text: t('modules.measures.types.volume'), value: 'volume' },
  { text: t('modules.measures.types.length'), value: 'length' },
  { text: t('modules.measures.types.area'), value: 'area' },
  { text: t('modules.measures.types.count'), value: 'count' },
  { text: t('modules.measures.types.time'), value: 'time' },
])

const saveMeasure = () => {
  console.log('Saving measure:', measure.value)

  // Здесь будет логика сохранения через API
}
</script>
