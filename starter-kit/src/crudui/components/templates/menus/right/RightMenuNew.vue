<template>
  <v-menu  location="bottom" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-avatar v-bind="props" color="blue-grey" size="36px" >
        <v-icon>mdi-account</v-icon>
      </v-avatar>
    </template>

    <v-card min-width="250">
      <!-- Заголовок профиля -->
      <div class="d-flex align-center gap-3 pa-4 pb-2">
        <v-avatar class="mr-4" color="primary" size="48">
          <v-icon>mdi-account</v-icon>
        </v-avatar>

        <div>
          <div class="text-body-1 font-weight-medium">
            {{ meStore.username || "qwe@qweq.we" }}
          </div>
          <div class="text-caption text-disabled">
            {{ meStore.role_title }}
          </div>
        </div>
      </div>

      <v-divider class="mt-2" />

      <!-- Пункты меню -->
      <v-list density="compact" class="py-2">
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="handleItemClick(item)"
          :prepend-icon="item.icon"
          :title="item.title">
          <template v-slot:append v-if="item.badge">
            <v-badge :content="item.badge" color="error" inline />
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-item
          @click="handleLogout"
          prepend-icon="mdi-logout"
          title="Выход"
          class="mx-2 rounded"
        />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useMeStore } from "@crudui/stores/meStore";

const meStore = useMeStore();
const router = useRouter();

const menuItems = [
  {
    title: "Профиль",
    icon: "mdi-account-outline",
    route: "/profile",
  },
  {
    title: "Биллинг",
    icon: "mdi-credit-card-outline",
    route: "/billing",
    badge: "4",
  },
  {
    title: "Подписка",
    icon: "mdi-currency-usd",
    route: "/pricing",
  },
  {
    title: "FAQ",
    icon: "mdi-help-circle-outline",
    route: "/faq",
  },
];

const handleItemClick = (item) => {
  if (item.route) {
    router.push(item.route);
  }
};

const handleLogout = async () => {
  await meStore.logout();
};
</script>
