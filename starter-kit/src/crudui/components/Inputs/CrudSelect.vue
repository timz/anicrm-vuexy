<template>
  <v-select
    ref="selectRef"
    v-model="model"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="label"
    :rules="rules"
    :disabled="disable"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
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
  label: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  disable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const selectRef = ref()
</script>
