<script setup lang="ts">
import CustomRadios from '@core/components/app-form-elements/CustomRadios.vue'
import type { CustomInputContent } from '@core/utils/types'

const radioContent: CustomInputContent[] = [
  {
    title: 'Продление на 1 месяц',
    value: 'credit card',
  },
  {
    title: 'Продление на 1 год',
    value: 'paypal',
  },
]

const selectedRadio = ref('credit card')
const isPricingPlanDialogVisible = ref(false)
</script>

<template>
  <div class="payment-page">
    <VContainer>
      <div class="d-flex justify-center align-center payment-card">
        <VCard class="px-8 py-4">
          <VRow>
            <VCol cols="12" md="7" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
              <h4 class="text-h4 mb-2">
                Оплата подписки
              </h4>
              <div class="text-body-1">
                Выберите вариант продления подписки или измените текущий план
              </div>
              <div class="mt-4 w-100 bg-grey-100">
                <div class="d-flex align-center gap-2 flex-wrap pa-4">
                  Текущий тарифный план: <strong>"Профи"</strong>
                  <VSpacer />
                  <VBtn variant="tonal" @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible">
                    Изменить
                  </VBtn>
                </div>
              </div>

              <CustomRadios v-model:selected-radio="selectedRadio" :radio-content="radioContent" class="my-4">
                <template #default="{ item }">
                  <div class="d-flex align-center gap-x-4 ms-3">
                    <h6 class="text-h6">
                      {{ item.title }}
                    </h6>
                  </div>
                </template>
              </CustomRadios>
            </VCol>

            <VCol cols="12" md="5">
              <h4 class="text-h4 mb-2">
                Сводка по заказу
              </h4>

              <div class="my-4">
                <div class="d-flex justify-space-between mb-2">
                  <span>Стоимость подписки</span>
                  <h6 class="text-h6">
                    $85.99
                  </h6>
                </div>
                <div class="d-flex justify-space-between">
                  <span>НДС</span>
                  <h6 class="text-h6">
                    $4.99
                  </h6>
                </div>
                <VDivider class="my-4" />
                <div class="d-flex justify-space-between">
                  <span>Итого</span>
                  <h6 class="text-h6">
                    $90.98
                  </h6>
                </div>
              </div>

              <VBtn block color="success" class="mb-4">
                <template #append>
                  <VIcon icon="tabler-arrow-right" class="flip-in-rtl" />
                </template>
                Перейти к оплате
              </VBtn>

              <div class="text-body-1">
                Продолжая, вы принимаете наши Условия обслуживания и Политику конфиденциальности.
              </div>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </VContainer>

    <!-- Pricing Plan Dialog -->
    <VDialog v-model="isPricingPlanDialogVisible" max-width="800">
      <VCard>
        <VCardTitle class="text-h5 pa-5">
          Select Plan
        </VCardTitle>
        <VCardText>
          <div class="text-body-1 mb-4">
            Choose the plan that best fits your needs.
          </div>
          <!-- Placeholder for pricing plans content -->
          <VRow>
            <VCol cols="12" md="4">
              <VCard variant="outlined">
                <VCardText class="text-center">
                  <h4 class="text-h4 mb-2">
                    Basic
                  </h4>
                  <div class="text-h2 my-3">
                    $29<span class="text-body-1">/mo</span>
                  </div>
                  <VBtn variant="outlined" block>
                    Select
                  </VBtn>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="12" md="4">
              <VCard variant="outlined" color="primary">
                <VCardText class="text-center">
                  <h4 class="text-h4 mb-2">
                    Standard
                  </h4>
                  <div class="text-h2 my-3">
                    $59<span class="text-body-1">/mo</span>
                  </div>
                  <VBtn color="primary" block>
                    Select
                  </VBtn>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="12" md="4">
              <VCard variant="outlined">
                <VCardText class="text-center">
                  <h4 class="text-h4 mb-2">
                    Premium
                  </h4>
                  <div class="text-h2 my-3">
                    $99<span class="text-body-1">/mo</span>
                  </div>
                  <VBtn variant="outlined" block>
                    Select
                  </VBtn>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isPricingPlanDialogVisible = false">
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  max-width: 800px;
  margin: 0 auto;
}
.payment-card {
  .custom-radio {
    .v-radio {
      margin-block-start: 0 !important;
    }
  }
}
</style>
