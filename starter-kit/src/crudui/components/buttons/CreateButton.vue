<template>
  <crud-button-primary v-bind="$attrs">
    <v-icon v-if="icon" start :icon="icon" />
    {{ label || $t('common.create') }}
  </crud-button-primary>
</template>

<script setup lang="ts">
import CrudButtonPrimary from './CrudButtonPrimary.vue'

interface Props {
  label?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-plus',
})
</script>