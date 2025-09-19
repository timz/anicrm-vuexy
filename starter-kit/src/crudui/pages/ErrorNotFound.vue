<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h1 text-primary mb-4">
              404
            </div>
            <div class="text-h4 mb-4">
              Страница не найдена
            </div>
            <p class="text-body-1 mb-6">
              К сожалению, запрашиваемая страница не существует.
            </p>
            <v-btn
              color="primary"
              to="/"
              size="large"
            >
              Вернуться на главную
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// 404 Error page
</script>
