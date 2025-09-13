<script setup lang="ts">
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'clean',
    public: true,
  },
})

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
</script>

<template>
  <!-- 👉 Auth Card -->
  <VCard
    class="auth-card"
    max-width="460"
    :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
  >
    <VCardItem class="justify-center">
      <VCardTitle>
        <RouterLink to="/">
          <div class="app-logo">
            <VNodeRenderer :nodes="themeConfig.app.logo" />

          </div>
        </RouterLink>
      </VCardTitle>
    </VCardItem>

    <VCardText>
      <p class="mb-0 text-center">Пожалуйста, войдите в личный кабинет</p>
    </VCardText>

    <VCardText>
      <VForm @submit.prevent="() => {}">
        <VRow>
          <!-- email -->
          <VCol cols="12">
            <AppTextField
              v-model="form.email"
              autofocus
              label="Email or Username"
              type="email"
              placeholder="johndoe@email.com"
            />
          </VCol>

          <!-- password -->
          <VCol cols="12">
            <AppTextField
              v-model="form.password"
              label="Password"
              placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="password"
              :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />

            <!-- remember me checkbox -->
            <div class="d-flex align-center justify-space-between flex-wrap my-6">
              <VCheckbox
                v-model="form.remember"
                label="Remember me"
              />

              <a
                class="text-primary"
                href="javascript:void(0)"
              >
                Forgot Password?
              </a>
            </div>

            <!-- login button -->
            <VBtn
              block
              type="submit"
            >
              Login
            </VBtn>
          </VCol>

          <!-- create account -->
          <VCol
            cols="12"
            class="text-body-1 text-center"
          >
            <span class="d-inline-block">
              New on our platform?
            </span>
            <a
              class="text-primary ms-1 d-inline-block text-body-1"
              href="javascript:void(0)"
            >
              Create an account
            </a>
          </VCol>

          <VCol
            cols="12"
            class="d-flex align-center"
          >
            <VDivider />
            <span class="mx-4 text-high-emphasis">or</span>
            <VDivider />
          </VCol>

          <!-- auth providers -->
          <VCol
            cols="12"
            class="text-center"
          >
            <AuthProvider />
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
