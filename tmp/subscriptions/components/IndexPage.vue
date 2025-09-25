<template>
  <subscription-selector/>
</template>

<script setup lang="ts">
import {setPageTitle} from '@crud/services/PageService'
import {onMounted} from 'vue'
import SubscriptionSelector from '@modules/subscriptions/components/SubscriptionSelector.vue'

onMounted(() => {
  setPageTitle('Подписки')
})
</script>
