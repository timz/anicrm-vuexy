<script lang="ts" setup>
import type { CustomInputContent } from '@core/utils/types'

interface Props {
  selectedRadio: string
  radioContent: CustomInputContent[]
}

interface Emit {
  (e: 'update:selectedRadio', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const updateSelectedOption = (value: string | null) => {
  if (value !== null)
    emit('update:selectedRadio', value)
}
</script>

<template>
  <VRadioGroup
    v-if="props.radioContent"
    :model-value="props.selectedRadio"
    @update:model-value="updateSelectedOption"
  >
    <VRow dense>
      <VCol
        v-for="item in props.radioContent"
        :key="item.title"
        cols="12"
      >
        <VLabel
          class="custom-input custom-radio-icon rounded cursor-pointer"
          :class="props.selectedRadio === item.value ? 'active' : ''"
        >
          <div>
            <VRadio
              :name="item.value"
              :value="item.value"
            />
          </div>
          <slot :item="item">
            <div class="d-flex flex-column align-center text-center">
              <h6 class="text-h6">
                {{ item.title }}
              </h6>
              <p class="text-body-2 mb-0">
                {{ item.desc }}
              </p>
            </div>
          </slot>
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
</template>

<style lang="scss" scoped>
.custom-radio-icon {
  display: flex;
}
</style>
