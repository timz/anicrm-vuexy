<template>
  <div class="fill-height d-flex flex-column">
    <!-- Logo Section -->
    <div class="px-4 pt-3 pb-2" style="height: 50px;">
      <div class="text-h5 font-weight-bold text-blue-grey-lighten-4" style="font-size: 36px; text-transform: uppercase; letter-spacing: normal;">
        Ani<span class="text-white">CRM</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <v-list density="comfortable" nav class="text-blue-grey-lighten-4 flex-grow-1">
      <template v-for="item in meStore.leftMenu" :key="item.title">
        <MenuCategory v-if="item.childItems" v-bind="item" />
        <MenuItem v-else v-bind="item" />
      </template>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import MenuCategory from './MenuCategory.vue'
import MenuItem from './MenuItem.vue'
import { useMeStore } from '@crudui/stores/meStore'

defineProps({
  menuItems: Array,
})

const meStore = useMeStore()
</script>

<style scoped>
:deep(.v-list-item-title) {
  font-size: 15px !important;
  font-weight: 400 !important;
}
</style>