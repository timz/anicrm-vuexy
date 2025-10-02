<template>
  <CenteredContentWrapper>
    <div class="text-center mb-15">
      <!-- 👉 Title and subtitle -->
      <h4 class="text-h4 font-weight-medium mb-2">
        <span class="text-h1">🚧</span><br>
        Аккаунт организации временно приостановлен
      </h4>
      <p class="text-h5 text-medium-emphasis mb-6">
        С Вашей учетной записью все в порядке. <br>Владельцу организации необходимо проверить свою учетную запись
      </p>
      <crud-button-primary> Проверить еще раз </crud-button-primary>
    </div>
  </CenteredContentWrapper>
</template>

<script setup lang="ts">
import CenteredContentWrapper from '@core/components/templates/CenteredContentWrapper.vue'
</script>
