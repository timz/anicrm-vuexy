<template>
  <v-checkbox
    v-bind="$props"
    density="compact"
    hide-details="auto"
    color="primary"
  />
</template>

<script setup lang="ts">
import commonProps from '@crudui/components/Inputs/interfaces/CommonProps'

defineProps({
  ...commonProps,
})
</script>