<template>
  <v-row>
    <v-col cols="12" md="6" lg="5">
      <v-card class="pa-6 rounded-lg soft-shadow">
        <!-- Показываем лоадер пока данные не готовы -->
        <div v-if="!isDataReady" class="text-center pa-4">
          <v-progress-circular indeterminate size="40" />
          <div class="text-grey mt-2">Загрузка данных...</div>
        </div>

        <!-- Показываем форму когда данные готовы -->
        <template v-else>
          <v-form ref="formRef" @submit.prevent="handleSave">
            <v-row class="v-row-form">
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
        </template>

        <template v-if="isDataReady">
          <v-row class="align-center justify-end pa-2 mt-4 ga-2">
            <slot
              name="actions"
              :on-save="handleSave"
              :on-cancel="handleCancel"
              :state-processing="stateProcessing"
              :is-create-mode="isCreateMode"
              :is-edit-mode="!isCreateMode"
            />
            <v-spacer />
            <crud-button-secondary
              :disabled="stateProcessing"
              @click="handleCancel"
            >
              Закрыть
            </crud-button-secondary>
            <crud-button-primary
              :disabled="stateProcessing"
              :loading="stateProcessing"
              @click="handleSave"
            >
              Сохранить
            </crud-button-primary>
          </v-row>
        </template>
      </v-card>
    </v-col>

    <v-col v-if="visibleTabs.length > 0" cols="12" md="6" lg="7">
      <!-- Табы отображаются отдельно, после карточки формы -->
      <div class="d-flex flex-column">
        <!-- Кнопочный переключатель табов -->
        <div class="d-flex flex-wrap mb-4 ga-2">
          <v-btn
            class="rounded-lg"
            v-for="tab in visibleTabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :color="activeTab === tab.name ? 'blue-grey-darken-1' : undefined"
            :variant="activeTab === tab.name ? 'flat' : 'text'"
          >
            <v-icon v-if="tab.icon" :icon="tab.icon" class="mr-1" size="small" />
            {{ tab.label }}
            <v-badge v-if="tab.badge" :content="tab.badge" class="ml-2" />
          </v-btn>
        </div>

        <template v-for="tab in visibleTabs" :key="tab.name">
          <component
            v-if="activeTab === tab.name && shouldRenderTab(tab.name)"
            :is="tab.tab"
            :parent-id="parentId"
            v-bind="tab.meta"
          />
        </template>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { CrudEditPageReturn } from "@crud/providers/useCrudEditPage";
import type {
  CrudTabInterface,
  TabContext,
} from "@crud/components/forms/tabs/TabTypes";
import CrudButtonSecondary from "@crud/components/buttons/CrudButtonSecondary.vue";
import CrudButtonPrimary from "@crud/components/buttons/CrudButtonPrimary.vue";

interface Props {
  providerKey?: string;
  tabs?: CrudTabInterface[];
  lazy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  providerKey: "editPageProvider",
  tabs: () => [],
  lazy: true,
});

const route = useRoute();
const editPageProvider = inject<CrudEditPageReturn>(props.providerKey);

if (!editPageProvider) {
  throw new Error(`Provider with key "${props.providerKey}" not found`);
}

const {
  model,
  isCreateMode,
  stateProcessing,
  formRef,
  version,
  forcedSave,
  handleSave,
  handleCancel,
  isDataReady,
} = editPageProvider;

// Логика табов
const activeTab = ref<string>("");

// Создаем контекст для табов
const tabContext = computed(
  (): TabContext => ({
    isNew: isCreateMode.value,
    parentId: model.value.id,
    formData: model.value,
    userPermissions: [], // TODO: получить из меню или editPageProvider
    routeParams: route.params,
  }),
);

// Определяем видимые табы
const visibleTabs = computed(() =>
  props.tabs.filter((tab) => {
    // Проверяем права доступа
    if (tab.permissions?.length) {
      const hasPermission = tab.permissions.some((permission) =>
        tabContext.value.userPermissions?.includes(permission),
      );
      if (!hasPermission) return false;
    }

    // Проверяем кастомное условие видимости
    if (tab.visible) {
      return tab.visible(tabContext.value);
    }

    return true;
  }),
);

// parentId для передачи в компоненты табов
const parentId = computed(() => model.value.id);

// Автоматически устанавливаем первую доступную вкладку как активную
watch(
  visibleTabs,
  (newTabs) => {
    if (newTabs.length > 0 && !activeTab.value) {
      activeTab.value = newTabs[0].name;
    }
    // Если текущая активная вкладка стала недоступна
    if (
      activeTab.value &&
      !newTabs.find((tab) => tab.name === activeTab.value)
    ) {
      activeTab.value = newTabs[0]?.name || "";
    }
  },
  { immediate: true },
);

// Следим за изменением parentId для автоматической установки первой вкладки
watch(
  () => parentId.value,
  (newParentId) => {
    if (newParentId && visibleTabs.value.length > 0) {
      if (!activeTab.value) {
        activeTab.value = visibleTabs.value[0].name;
      }
    }
  },
);

const shouldRenderTab = (tabName: string): boolean => {
  if (!props.lazy) return true;
  // Для lazy loading рендерим только активную вкладку
  return activeTab.value === tabName;
};
</script>

<style scoped>

</style>
