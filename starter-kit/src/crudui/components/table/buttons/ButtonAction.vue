<template>
  <IconBtn :class="buttonClass" :color="color || 'primary'" @click="$emit('click', $event)">
    <VIcon :icon="icon" />
    <v-tooltip v-if="tooltip" activator="parent" location="top">
      {{ tooltip }}
    </v-tooltip>
  </IconBtn>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  color?: string
  tooltip?: string
  buttonClass?: string
}

defineProps<Props>()
defineEmits(['click'])
</script>
