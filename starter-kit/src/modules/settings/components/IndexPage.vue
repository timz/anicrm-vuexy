<template>
  <v-row>
    <v-col cols="6">
      <VCard>
        <div class="pa-4">
          <VCardTitle>{{ $t('modules.settings.companyResources') }}</VCardTitle>
          <VList nav>
            <VListItem v-for="item in items" :key="item.value" :value="item.value" :to="item.route">
              <template #prepend>
                <VIcon :icon="item.prependIcon" />
              </template>

              <VListItemTitle>
                {{ item.title }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </div>
      </VCard>
    </v-col>
    <v-col cols="6">
      <VCard>
        <div class="pa-4">
          <VCardTitle>{{ $t('modules.settings.crm') }}</VCardTitle>
          <VList nav>
            <VListItem v-for="item in itemsCrm" :key="item.value" :value="item.value" :to="item.route">
              <template #prepend>
                <VIcon :icon="item.prependIcon" />
              </template>

              <VListItemTitle>
                {{ item.title }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </div>
      </VCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const items = computed(() => [
  { title: t('modules.measures.title'), value: 1, prependIcon: 'tabler-list-details', route: '/measures' },
  { title: t('modules.eventTypes.title'), value: 2, prependIcon: 'tabler-list-details', route: '/event-types' },
])

const itemsCrm = computed(() => [
  { title: t('modules.advSources.title'), value: 1, prependIcon: 'tabler-list-details', route: '/adv-sources' },
  { title: t('modules.rejectionReasons.title'), value: 2, prependIcon: 'tabler-list-details', route: '/rejection-reasons' },
])
</script>
