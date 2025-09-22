<template>
  <v-checkbox
    v-model="model"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    density="comfortable"
    hide-details="auto"
    color="primary"
  />
</template>

<script setup lang="ts">
const model = defineModel()

defineProps<{
  label?: string
  rules?: any[]
  disabled?: boolean
  readonly?: boolean
}>()
</script>
