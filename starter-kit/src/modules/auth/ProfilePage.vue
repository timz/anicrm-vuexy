<script lang="ts" setup>
import AccountSettingsAccount from './components/AccountSettingsAccount.vue'
import AccountSettingsSecurity from './components/AccountSettingsSecurity.vue'

const activeTab = ref('account')

// tabs
const tabs = [
  { title: 'Профиль', icon: 'tabler-users', tab: 'account' },
  { title: 'Безопасность', icon: 'tabler-lock', tab: 'security' },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

    </VWindow>
  </div>
</template>
