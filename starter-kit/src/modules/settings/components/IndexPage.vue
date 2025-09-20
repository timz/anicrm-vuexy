<template>
  <v-row>
    <v-col cols="6">
      <VCard>
        <div class="pa-4">
          <VCardTitle>Ресурсы компании</VCardTitle>
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
          <VCardTitle>CRM</VCardTitle>
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
const items = [
  { title: 'Единицы измерения', value: 1, prependIcon: 'tabler-list-details', route: '/measures' },
  { title: 'Типы событий', value: 2, prependIcon: 'tabler-list-details', route: '/event-types' },
]

const itemsCrm = [
  { title: 'Источники рекламы', value: 1, prependIcon: 'tabler-list-details', route: '/adv-sources' },
  { title: 'Причины отказов', value: 2, prependIcon: 'tabler-list-details', route: '/rejection-reasons' },
]
</script>
