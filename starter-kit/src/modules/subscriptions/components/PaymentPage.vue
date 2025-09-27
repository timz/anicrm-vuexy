<script setup lang="ts">
import CustomRadios from '@core/components/app-form-elements/CustomRadios.vue'
import type { CustomInputContent } from '@core/utils/types'

const radioContent: CustomInputContent[] = [
  {
    title: 'Credit Card',
    value: 'credit card',
  },
  {
    title: 'PayPal',
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
        <VCard width="100%">
          <VRow>
            <VCol cols="12" md="7" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
              <VCardText class="pa-8 pe-5">
                <!-- Checkout header -->
                <div>
                  <h4 class="text-h4 mb-2">Оплата подписки</h4>
                  <div class="text-body-1">
                    All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit
                    your needs.
                  </div>
                </div>

                <CustomRadios
                  v-model:selected-radio="selectedRadio"
                  :radio-content="radioContent"
                  class="my-8"
                >
                  <template #default="{ item }">
                    <div class="d-flex align-center gap-x-4 ms-3">
                      <h6 class="text-h6">
                        {{ item.title }}
                      </h6>
                    </div>
                  </template>
                </CustomRadios>
              </VCardText>
            </VCol>

            <VCol cols="12" md="5">
              <VCardText class="pa-8 ps-5">
                <!-- order summary -->
                <div class="mb-8">
                  <h4 class="text-h4 mb-2">Order Summary</h4>
                  <div class="text-body-1">
                    It can help you manage and service orders before, during, and after fulfillment.
                  </div>
                </div>

                <VCard flat color="rgba(var(--v-theme-on-surface), var(--v-hover-opacity))">
                  <VCardText>
                    <div class="text-body-1">A simple start for everyone</div>
                    <h1 class="text-h1 my-4">$59.99<span class="text-body-1 font-weight-medium">/month</span></h1>
                    <VBtn variant="tonal" block @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible">
                      Change Plan
                    </VBtn>
                  </VCardText>
                </VCard>

                <div class="my-5">
                  <div class="d-flex justify-space-between mb-2">
                    <span>Subscription</span>
                    <h6 class="text-h6">$85.99</h6>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span>Tax</span>
                    <h6 class="text-h6">$4.99</h6>
                  </div>
                  <VDivider class="my-4" />
                  <div class="d-flex justify-space-between">
                    <span>Total</span>
                    <h6 class="text-h6">$90.98</h6>
                  </div>
                </div>

                <VBtn block color="success" class="mb-8">
                  <template #append>
                    <VIcon icon="tabler-arrow-right" class="flip-in-rtl" />
                  </template>
                  Proceed With Payment
                </VBtn>

                <div class="text-body-1">
                  By continuing, you accept to our Terms of Services and Privacy Policy. Please note that payments are
                  non-refundable.
                </div>
              </VCardText>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </VContainer>

    <!-- Pricing Plan Dialog -->
    <VDialog v-model="isPricingPlanDialogVisible" max-width="800">
      <VCard>
        <VCardTitle class="text-h5 pa-5"> Select Plan </VCardTitle>
        <VCardText>
          <div class="text-body-1 mb-4">Choose the plan that best fits your needs.</div>
          <!-- Placeholder for pricing plans content -->
          <VRow>
            <VCol cols="12" md="4">
              <VCard variant="outlined">
                <VCardText class="text-center">
                  <h4 class="text-h4 mb-2">Basic</h4>
                  <div class="text-h2 my-3">$29<span class="text-body-1">/mo</span></div>
                  <VBtn variant="outlined" block>Select</VBtn>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="12" md="4">
              <VCard variant="outlined" color="primary">
                <VCardText class="text-center">
                  <h4 class="text-h4 mb-2">Standard</h4>
                  <div class="text-h2 my-3">$59<span class="text-body-1">/mo</span></div>
                  <VBtn color="primary" block>Select</VBtn>
                </VCardText>
              </VCard>
            </VCol>
            <VCol cols="12" md="4">
              <VCard variant="outlined">
                <VCardText class="text-center">
                  <h4 class="text-h4 mb-2">Premium</h4>
                  <div class="text-h2 my-3">$99<span class="text-body-1">/mo</span></div>
                  <VBtn variant="outlined" block>Select</VBtn>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isPricingPlanDialogVisible = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
.payment-card {
  .custom-radio {
    .v-radio {
      margin-block-start: 0 !important;
    }
  }
}
</style>
