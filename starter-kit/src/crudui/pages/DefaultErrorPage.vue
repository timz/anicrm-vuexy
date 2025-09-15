<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-card-title class="text-h4 text-center pa-6">
            <v-icon size="large" color="error" class="mr-3">
              mdi-alert-circle
            </v-icon>
            Ошибка
          </v-card-title>
          <v-card-text class="text-center pa-6">
            <p class="text-body-1">
              {{ $route.meta.description || 'Произошла ошибка' }}
            </p>
          </v-card-text>
          <v-card-actions class="justify-center pa-6">
            <v-btn 
              color="primary" 
              @click="goHome"
              prepend-icon="mdi-home"
            >
              На главную
            </v-btn>
            <v-btn 
              variant="outlined" 
              @click="goBack"
              prepend-icon="mdi-arrow-left"
            >
              Назад
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'dashboardIndex' })
}

const goBack = () => {
  router.back()
}
</script>