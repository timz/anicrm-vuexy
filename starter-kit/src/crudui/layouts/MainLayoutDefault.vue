<template>
  <v-app>
    <!-- Left Navigation Drawer -->
    <v-navigation-drawer
      v-model="leftDrawerOpen"
      permanent
      location="left"
      color="blue-grey-darken-3"
      width="280"
      class="text-blue-grey-lighten-4"
      :border="false"
    >
      <left-menu />
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-blue-grey-lighten-5">
      <v-container class="navbar-content-container">
        <div
          class="navbar-blur mb-6 bg-white py-1 px-3 rounded-lg layout-navbar text-blue-grey soft-shadow"
        >
          <div class="d-flex align-center h-100">
            <v-btn
              icon
              variant="text"
              color="default"
              @click="leftDrawerOpen = !leftDrawerOpen"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>

            <v-spacer />

            <!-- Right Side Actions -->
            <div class="d-flex align-center ga-1">
              <!-- Notification Button -->
              <v-btn icon variant="text" color="default">
                <v-icon>mdi-bell-outline</v-icon>
              </v-btn>

              <!-- User Menu -->
              <right-menu-new />
            </div>
          </div>
        </div>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LeftMenu from "@crudui/components/templates/menus/left/LeftMenu.vue";
import RightMenuNew from "@crudui/components/templates/menus/right/RightMenuNew.vue";

const leftDrawerOpen = ref(true);
</script>

<style scoped>


.layout-navbar {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.navbar-content-container {
  width: 100%;
  max-width: 1392px;
  margin: 0 auto;
}

/* Main Content Styles */
.boxed-content {
  background-color: #f5f5f5;
  padding-top: 16px;
}

.content-container {
  max-width: 1440px;
  margin: 0 96.5px;
  padding: 24px;
  min-height: calc(100vh - 144px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 1680px) {
  .layout-navbar {
  }

  .content-container {
  }
}

@media (max-width: 1440px) {
  .layout-navbar {
  }

  .content-container {
  }
}

@media (max-width: 1280px) {
  .layout-navbar {
  }

  .content-container {
  }
}

@media (max-width: 960px) {
  .layout-navbar {
  }

  .content-container {
  }

  .navbar-content-container {
  }
}

@media (max-width: 600px) {
  .layout-navbar {
    margin: 0 4px;
  }

  .content-container {
    margin: 0 4px;
  }

  .boxed-content {
    padding-top: 88px;
  }
}
</style>
