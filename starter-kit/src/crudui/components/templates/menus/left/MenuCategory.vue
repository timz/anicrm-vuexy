<template>
  <v-list-group :value="name">
    <template #activator="{ props: activatorProps }">
      <v-list-item
        v-bind="activatorProps"
        :prepend-icon="props.icon"
        :title="title"
        rounded="lg"
        class="ma-1"
      />
    </template>

    <MenuItem 
      v-for="item in childItems" 
      :key="item.name" 
      :title="item.title" 
      :is-child="true" 
      v-bind="item"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import MenuItem from './MenuItem.vue'

interface MenuCategoryProps {
  title: string
  name: string
  icon?: string
  childItems?: Array<unknown>
}

const props = withDefaults(defineProps<MenuCategoryProps>(), {
  icon: 'mdi-folder'
})
</script>