<script setup lang="ts">
import CustomRadios from '@core/components/app-form-elements/CustomRadios.vue'
import type { CustomInputContent } from '@core/utils/types'
import AppPricing from '@modules/subscriptions/components/AppPricing.vue'
import DialogCloseBtn from '@core/components/dialogs/DialogCloseBtn.vue'

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
        <div class="bg-surface rounded-lg">
          <VRow no-gutters>
            <VCol class="px-8 py-4" cols="12" md="7" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
              <h4 class="text-h4 mb-2">
                Оплата подписки
              </h4>
              <div class="text-body-1">
                Выберите вариант продления подписки или измените текущий план
              </div>
              <div class="mt-4 w-100 bg-grey-100 rounded-lg">
                <div class="d-flex align-center gap-2 flex-wrap pa-4">
                  <div>
                    <small>Тарифный план:</small><br>
                    <strong>"Профи"</strong>
                  </div>
                  <v-spacer />
                  <VBtn
                    color="primary"
                    variant="tonal"
                    @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible"
                  >
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

            <VCol class="px-8 py-4" cols="12" md="5">
              <h4 class="text-h4 mb-2">
                Сводка по заказу
              </h4>

              <div class="my-5">
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

              <VBtn block color="primary" class="mb-4">
                <template #append>
                  <VIcon icon="tabler-arrow-right" class="flip-in-rtl" />
                </template>
                Перейти к оплате
              </VBtn>

              <div class="text-body-1 mb-2">
                Продолжая, вы принимаете наши Условия обслуживания и Политику конфиденциальности.
              </div>
            </VCol>
          </VRow>
        </div>
      </div>
    </VContainer>

    <!-- Pricing Plan Dialog -->
    <VDialog v-model="isPricingPlanDialogVisible" max-width="960">
      <VCard class="pa-6">
        <AppPricing md="4" />
      </VCard>
      <DialogCloseBtn @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible" />
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  max-width: 820px;
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
