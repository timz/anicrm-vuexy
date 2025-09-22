<template>
  <PageTitle>{{ $t('modules.products.single') }}</PageTitle>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">
      {{ $t('common.dialog.editTitle') }}
    </h1>
    <p>{{ $t('common.editForm') }}</p>
  </div>
</template>

<script setup lang="ts">
// Страница редактирования
import PageTitle from '@crudui/components/templates/PageTitle.vue'
</script>
