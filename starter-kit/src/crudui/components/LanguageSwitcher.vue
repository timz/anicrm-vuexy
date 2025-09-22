<template>
  <VMenu
    v-model="isMenuOpen"
    location="bottom end"
    transition="slide-y-transition"
  >
    <template #activator="{ props }">
      <VTooltip text="Изменить язык" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <VBtn
            class="me-2 language-switcher-btn"
            v-bind="{ ...props, ...tooltipProps }"
            variant="text"
            color="default"
            size="small"
          >
            <VIcon icon="tabler-language" class="me-1" />
            <span class="text-caption font-weight-medium">{{ currentShortCode }}</span>
          </VBtn>
        </template>
      </VTooltip>
    </template>

    <VList density="compact" min-width="180" class="language-list">
      <VListItem
        v-for="locale in availableLocales"
        :key="locale.code"
        :active="currentLocale === locale.code"
        class="language-item"
        @click="changeLocale(locale.code)"
      >
        <template #prepend>
          <span class="language-flag me-2">{{ locale.flag }}</span>
        </template>
        <VListItemTitle class="d-flex align-center">
          {{ locale.name }}
        </VListItemTitle>
        <template v-if="currentLocale === locale.code" #append>
          <VIcon icon="tabler-check" size="18" color="primary" />
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script setup lang="ts">
import { useLocale } from '@crudui/composables/useLocale'

const { locale: currentLocale, availableLocales, setLocale, getShortCode } = useLocale()
const isMenuOpen = ref(false)

const currentShortCode = computed(() => getShortCode(currentLocale.value))

const changeLocale = (newLocale: string) => {
  setLocale(newLocale)
  nextTick(() => {
    isMenuOpen.value = false
  })
}
</script>

<style lang="scss" scoped>
.language-switcher-btn {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.language-list {
  .language-item {
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.04);
    }

    &.v-list-item--active {
      background-color: rgba(var(--v-theme-primary), 0.08);
    }
  }

  .language-flag {
    font-size: 1.2rem;
    line-height: 1;
  }
}
</style>
