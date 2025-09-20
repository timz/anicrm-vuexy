<template>
  <v-btn
    v-bind="$attrs"
    variant="text"
    rounded
    :color="color"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <v-icon>{{ icon }}</v-icon>
    <v-tooltip
      v-if="tooltip"
      activator="parent"
      location="top"
    >
      {{ tooltip }}
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  color?: string
  tooltip?: string
  buttonClass?: string
}

defineProps<Props>()
defineEmits(['click'])
</script>
