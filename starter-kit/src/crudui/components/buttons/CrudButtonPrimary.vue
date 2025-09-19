<template>
  <v-btn
    variant="flat"
    color="primary"
    rounded="xs"
    :loading="isLoading || globalIsLoading"
    :disabled="globalIsLoading"
    v-bind="$attrs"
    class="px-4"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { type ComputedRef, computed, inject } from 'vue'

const isLoading: boolean = inject('isLoading', false)

const globalIsLoading = inject<ComputedRef<boolean>>(
  'globalIsLoading',
  computed(() => false),
)
</script>
