<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { CrudEditPageReturn } from '@crudui/providers/useCrudEditPage'
import type { CrudTabInterface, TabContext } from '@crudui/components/forms/tabs/TabTypes'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'

interface Props {
  providerKey?: string
  tabs?: CrudTabInterface[]
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  providerKey: 'editPageProvider',
  tabs: () => [],
  lazy: true,
})

const route = useRoute()
const editPageProvider = inject<CrudEditPageReturn>(props.providerKey)

if (!editPageProvider) {
  throw new Error(`Provider with key "${props.providerKey}" not found`)
}

const { model, isCreateMode, stateProcessing, formRef, version, forcedSave, handleSave, handleCancel, isDataReady } =
  editPageProvider

// Логика табов
const activeTab = ref<string>('')
const activeTabIndex = ref(0)

// Создаем контекст для табов
const tabContext = computed(
  (): TabContext => ({
    isNew: isCreateMode.value,
    parentId: model.value.id,
    formData: model.value,
    userPermissions: [], // TODO: получить из меню или editPageProvider
    routeParams: route.params,
  }),
)

// Определяем видимые табы
const visibleTabs = computed(() =>
  props.tabs.filter(tab => {
    // Проверяем права доступа
    if (tab.permissions?.length) {
      const hasPermission = tab.permissions.some(permission => tabContext.value.userPermissions?.includes(permission))

      if (!hasPermission)
        return false
    }

    // Проверяем кастомное условие видимости
    if (tab.visible)
      return tab.visible(tabContext.value)

    return true
  }),
)

// parentId для передачи в компоненты табов
const parentId = computed(() => model.value.id)

// Автоматически устанавливаем первую доступную вкладку как активную
watch(
  visibleTabs,
  newTabs => {
    if (newTabs.length > 0 && !activeTab.value) {
      activeTab.value = newTabs[0].name
      activeTabIndex.value = 0
    }

    // Если текущая активная вкладка стала недоступна
    if (activeTab.value && !newTabs.find(tab => tab.name === activeTab.value)) {
      activeTab.value = newTabs[0]?.name || ''
      activeTabIndex.value = 0
    }
  },
  { immediate: true },
)

// Синхронизация activeTabIndex с activeTab
watch(activeTabIndex, newIndex => {
  if (visibleTabs.value[newIndex]) {
    activeTab.value = visibleTabs.value[newIndex].name
  }
})

// Следим за изменением parentId для автоматической установки первой вкладки
watch(
  () => parentId.value,
  newParentId => {
    if (newParentId && visibleTabs.value.length > 0 && !activeTab.value) {
      activeTab.value = visibleTabs.value[0].name
    }
  },
)

const shouldRenderTab = (tabName: string): boolean => {
  if (!props.lazy) {
    return true
  }

  // Для lazy loading рендерим только активную вкладку
  return activeTab.value === tabName
}
</script>

<template>
  <v-row>
    <!-- Левая панель с формой -->
    <v-col cols="12" md="5" lg="5">
      <v-card>
        <!-- Показываем лоадер пока данные не готовы -->
        <div v-if="!isDataReady" class="text-center pa-12">
          <v-progress-circular indeterminate size="40" color="primary" />
          <div class="text-grey mt-2">
            Загрузка данных...
          </div>
        </div>

        <!-- Показываем форму когда данные готовы -->
        <template v-else>
          <v-card-text class="pt-6">
            <!-- Форма с полями -->
            <v-form ref="formRef" @submit.prevent="handleSave">
              <v-row class="form-row">
                <slot
                  :model="model"
                  :is-create-mode="isCreateMode"
                  :is-edit-mode="!isCreateMode"
                  :state-processing="stateProcessing"
                  :form-ref="formRef"
                  :version="version"
                  :forced-save="forcedSave"
                />
              </v-row>
            </v-form>
          </v-card-text>

          <!-- Кнопки действий -->
          <v-card-text class="d-flex justify-center gap-x-4">
            <slot
              name="actions"
              :on-save="handleSave"
              :on-cancel="handleCancel"
              :state-processing="stateProcessing"
              :is-create-mode="isCreateMode"
              :is-edit-mode="!isCreateMode"
            />
            <v-spacer />
            <CrudButtonSecondary :disabled="stateProcessing" @click="handleCancel">
              Закрыть
            </CrudButtonSecondary>
            <CrudButtonPrimary :disabled="stateProcessing" :loading="stateProcessing" @click="handleSave">
              Сохранить
            </CrudButtonPrimary>
          </v-card-text>
        </template>
      </v-card>
    </v-col>

    <!-- Правая панель с табами -->
    <v-col v-if="visibleTabs.length > 0" cols="12" md="7" lg="7">
      <!-- Табы в стиле pill как в full-version -->
      <v-tabs v-model="activeTabIndex" class="v-tabs-pill mb-2" density="compact">
        <v-tab v-for="(tab, index) in visibleTabs" :key="tab.name" :value="index">
          <v-icon v-if="tab.icon" :icon="tab.icon" class="me-1" />
          <span>{{ tab.label }}</span>
          <v-badge v-if="tab.badge" :content="tab.badge" class="ms-2" inline />
        </v-tab>
      </v-tabs>

      <!-- Контент табов -->
      <v-window v-model="activeTabIndex" class="disable-tab-transition" :touch="false">
        <v-window-item v-for="(tab, index) in visibleTabs" :key="tab.name" :value="index">
          <component :is="tab.tab" v-if="shouldRenderTab(tab.name)" v-bind="tab.meta" />
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
// Стиль для табов-таблеток как в full-version
:deep(.v-tabs-pill) {
  .v-tab {
    border-radius: 0.5rem;
    font-weight: 500;
    min-height: 38px;
    padding: 0 1rem;
    text-transform: none !important;

    &.v-tab--selected {
      background-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }
  }
}

// Отключение анимации переключения табов
:deep(.disable-tab-transition) {
  .v-window__container {
    transition: none !important;
  }
}
</style>
