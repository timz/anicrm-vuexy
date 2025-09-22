<template>
  <VMenu
    v-model="isMenuOpen"
    location="bottom end"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <VBtn
        class="mr-2"
        v-bind="props"
        icon
        variant="text"
        color="default"
        size="small"
      >
        <VIcon icon="tabler-language" />
      </VBtn>
    </template>

    <VList density="compact" min-width="150">
      <VListItem
        v-for="locale in availableLocales"
        :key="locale.code"
        :active="currentLocale === locale.code"
        @click="changeLocale(locale.code)"
      >
        <VListItemTitle>{{ locale.name }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script setup lang="ts">
import { useLocale } from '@crudui/composables/useLocale'

const { locale: currentLocale, availableLocales, setLocale } = useLocale()
const isMenuOpen = ref(false)

const changeLocale = (newLocale: string) => {
  setLocale(newLocale)
  isMenuOpen.value = false
}
</script>
