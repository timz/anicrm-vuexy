<template>
  <VContainer>
    <VCard>
      <VCardTitle>Test CrudSelector Component</VCardTitle>
      <VCardText>
        <VForm ref="formRef">
          <VRow>
            <VCol cols="12" md="6">
              <h4 class="mb-4">Single Select with Static Data</h4>
              <CrudSelector
                v-model="singleValue"
                :data-options="staticOptions"
                label="Select One Option"
                :rules="[requiredRule]"
              />
              <div class="mt-2">Selected value: {{ singleValue }}</div>
            </VCol>

            <VCol cols="12" md="6">
              <h4 class="mb-4">Multiple Select with Static Data</h4>
              <CrudSelector
                v-model="multipleValue"
                :data-options="staticOptions"
                label="Select Multiple Options"
                :multiple="true"
              />
              <div class="mt-2">Selected values: {{ multipleValue }}</div>
            </VCol>

            <VCol cols="12" md="6">
              <h4 class="mb-4">With Form Provider (Single)</h4>
              <CrudSelector
                field="singleField"
                :data-options="staticOptions"
                label="Form Provider Single"
                provider-name="testFormProvider"
              />
              <div class="mt-2">Form value: {{ formModel.singleField }}</div>
            </VCol>

            <VCol cols="12" md="6">
              <h4 class="mb-4">With Form Provider (Multiple)</h4>
              <CrudSelector
                field="multipleField"
                :data-options="staticOptions"
                label="Form Provider Multiple"
                :multiple="true"
                provider-name="testFormProvider"
              />
              <div class="mt-2">Form values: {{ formModel.multipleField }}</div>
            </VCol>

            <VCol cols="12">
              <h4 class="mb-4">Disabled State</h4>
              <CrudSelector
                v-model="disabledValue"
                :data-options="staticOptions"
                label="Disabled Selector"
                :disabled="true"
              />
            </VCol>
          </VRow>
        </VForm>

        <VDivider class="my-6" />

        <VRow>
          <VCol cols="12">
            <VBtn @click="resetForm" class="mr-2">Reset Form</VBtn>
            <VBtn @click="validateForm" color="primary">Validate Form</VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import CrudSelector from '@crudui/components/Inputs/CrudSelector.vue'
import type { CrudSelectorOptionsList } from '@crudui/components/Inputs/interfaces/CrudSelectorTypes'
import type { UseCrudFormReturn } from '@crudui/providers/useCrudForm'
import type { FormModel } from '@crudui/types'

// Test data
const staticOptions: CrudSelectorOptionsList = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  { value: 4, label: 'Option 4' },
  { value: 5, label: 'Option 5' },
]

// Form values
const singleValue = ref<number | null>(null)
const multipleValue = ref<number[]>([])
const disabledValue = ref<number | null>(2)

// Form model for provider
const formModel = ref<FormModel>({
  singleField: null,
  multipleField: [],
})

// Mock form provider
const mockFormProvider: Partial<UseCrudFormReturn> = {
  model: formModel,
  stateLoading: ref(false),
  stateProcessing: ref(false),
}

// Provide mock form provider
provide('testFormProvider', mockFormProvider)

// Form ref
const formRef = ref()

// Validation rules
const requiredRule = (value: any) => !!value || 'This field is required'

// Form methods
const resetForm = () => {
  singleValue.value = null
  multipleValue.value = []
  formModel.value.singleField = null
  formModel.value.multipleField = []
  formRef.value?.resetValidation()
}

const validateForm = async () => {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    console.log('Form is valid!')
  }
}
</script>