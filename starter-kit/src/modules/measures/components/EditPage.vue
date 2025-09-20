<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <h1 class="text-h4">
              Редактирование единицы измерения
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveMeasure">
              <v-row>
                <v-col cols="12" md="6">
                  <crud-input
                    v-model="measure.title"
                    label="Название"
                    placeholder="Например: Килограмм"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <crud-input
                    v-model="measure.shortName"
                    label="Сокращение"
                    placeholder="Например: кг"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <crud-select
                    v-model="measure.type"
                    label="Тип измерения"
                    :items="measureTypes"
                    item-title="text"
                    item-value="value"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <crud-input
                    v-model="measure.coefficient"
                    label="Коэффициент"
                    type="number"
                    placeholder="1.0"
                  />
                </v-col>
                <v-col cols="12">
                  <crud-input
                    v-model="measure.description"
                    label="Описание"
                    type="textarea"
                    placeholder="Дополнительная информация об единице измерения"
                  />
                </v-col>
                <v-col cols="12">
                  <crud-checkbox
                    v-model="measure.isActive"
                    label="Активная единица измерения"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex ga-2">
                <crud-button-primary type="submit">
                  Сохранить
                </crud-button-primary>
                <crud-button-secondary @click="$router.go(-1)">
                  Отмена
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
import { ref } from 'vue'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CrudSelect from '@crudui/components/Inputs/CrudSelect.vue'
import CrudCheckbox from '@crudui/components/Inputs/CrudCheckbox.vue'

const measure = ref({
  title: '',
  shortName: '',
  type: null,
  coefficient: 1.0,
  description: '',
  isActive: true,
})

const measureTypes = [
  { text: 'Вес', value: 'weight' },
  { text: 'Объем', value: 'volume' },
  { text: 'Длина', value: 'length' },
  { text: 'Площадь', value: 'area' },
  { text: 'Количество', value: 'count' },
  { text: 'Время', value: 'time' },
]

const saveMeasure = () => {
  console.log('Saving measure:', measure.value)

  // Здесь будет логика сохранения через API
}
</script>
