<template>
  <v-select ref="selectRef" variant="outlined" density="comfortable" hide-details="auto" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  itemTitle: {
    type: String,
    default: 'title',
  },
  itemValue: {
    type: String,
    default: 'value',
  },
})

const selectRef = ref()
</script>
