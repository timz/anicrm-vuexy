<script setup lang="ts">
import { computed } from 'vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  message: undefined,
  confirmText: undefined,
  confirmColor: 'primary',
  cancelText: undefined,
  maxWidth: 400,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  confirmColor?: string
  cancelText?: string
  maxWidth?: string | number
}

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const handleConfirm = () => {
  emit('confirm')
  dialog.value = false
}

const handleCancel = () => {
  emit('cancel')
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" :max-width="maxWidth">
    <v-card class="pa-2">
      <v-card-title>
        {{ title || $t('common.confirmation') }}
      </v-card-title>
      <v-card-text>
        {{ message || $t('common.confirmAction') }}
      </v-card-text>
      <v-card-actions>
        <crud-button-secondary @click="handleCancel">
          {{ cancelText || $t('common.cancel') }}
        </crud-button-secondary>
        <v-btn class="px-4" :color="confirmColor" variant="flat" @click="handleConfirm">
          {{ confirmText || $t('common.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
