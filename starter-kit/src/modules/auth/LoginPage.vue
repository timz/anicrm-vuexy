<template>
  <v-card class="pa-8 " elevation="2">
    <v-card-text class="px-0">
      <v-expand-transition mode="out-in">
        <div v-if="!showResetForm">
          <login-form @go-reset-form="showResetForm = true" />
        </div>
        <div v-else>
          <reset-pass-form @go-login-form="showResetForm = false" />
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import ResetPassForm from './ResetPassForm.vue'

const showResetForm = ref(false)
</script>
