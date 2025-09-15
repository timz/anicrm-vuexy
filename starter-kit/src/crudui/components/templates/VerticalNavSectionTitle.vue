<script lang="ts" setup>
import { layoutConfig } from '@crudui/components/templates/helpers'
import { can } from '@crudui/plugins/casl'
import { useLayoutConfigStore } from '@crudui/components/templates/stores/config'
import type { NavSectionTitle } from '@crudui/components/templates/helpers/types'
import { getDynamicI18nProps } from '@crudui/components/templates/helpers/utils'

defineProps<{
  item: NavSectionTitle
}>()

const configStore = useLayoutConfigStore()
const shallRenderIcon = configStore.isVerticalNavMini()
</script>

<template>
  <li
    v-if="can(item.action, item.subject)"
    class="nav-section-title"
  >
    <div class="title-wrapper">
      <Transition
        name="vertical-nav-section-title"
        mode="out-in"
      >
        <Component
          :is="shallRenderIcon ? layoutConfig.app.iconRenderer : layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          :key="shallRenderIcon"
          :class="shallRenderIcon ? 'placeholder-icon' : 'title-text'"
          v-bind="{ ...layoutConfig.icons.sectionTitlePlaceholder, ...getDynamicI18nProps(item.heading, 'span') }"
        >
          {{ !shallRenderIcon ? item.heading : null }}
        </Component>
      </Transition>
    </div>
  </li>
</template>
