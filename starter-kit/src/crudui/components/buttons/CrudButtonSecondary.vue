<template>
  <v-btn
    color="grey-darken-1"
    variant="tonal"
    :loading="isLoading || globalIsLoading"
    :disabled="globalIsLoading"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue'

const isLoading: boolean = inject('isLoading', false)
const globalIsLoading = inject<ComputedRef<boolean>>('globalIsLoading', computed(() => false))
</script>