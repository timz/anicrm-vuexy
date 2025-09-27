<script setup lang="ts">
import AppPricing from '@modules/subscriptions/components/AppPricing.vue'
import CenteredContentWrapper from '@core/components/templates/CenteredContentWrapper.vue'
</script>

<template>
  <CenteredContentWrapper>
    <VRow>
      <VCol cols="12" sm="8" md="12" lg="10" class="mx-auto">
        <AppPricing md="4" />
      </VCol>
    </VRow>
  </CenteredContentWrapper>
</template>
