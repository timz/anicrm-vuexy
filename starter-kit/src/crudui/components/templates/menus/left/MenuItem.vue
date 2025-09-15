<template>
  <v-list-item
    :to="path"
    :target="target"
    active-class="bg-blue-grey-darken-3 text-blue-grey-lighten-1"
    :class="isChild ? 'py-2 text-white pl-8' : 'py-2 text-white'"
  >
    <template #prepend>
      <v-icon :icon="icon"  />
    </template>
    
    <v-list-item-title class="pt-1">{{ title }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { MenuItemInterface } from '@crudui/components/templates/menus/left/MenuItemInterface'

export default defineComponent({
  name: 'MenuItem',
  props: {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: '#'
    },
    icon: {
      type: String,
      default: 'apps'
    },
    target: {
      type: String
    },
    isChild: {
      type: Boolean,
      default: false
    },
    menuSort: {
      type: Number,
      default: 0
    },
    menuParenName: {
      type: String
    },
    childItems: {
      type: Array as PropType<MenuItemInterface[]>,
    },
    permissions: {
      type: Array as PropType<string[]>,
    }
  }
})
</script>