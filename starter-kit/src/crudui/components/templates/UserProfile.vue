<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import avatar1 from '@images/avatars/avatar-1.png'
import { notifications } from '@crudui/boot/notification'
import { clearAbilityRules } from '@crudui/plugins/casl/index'
import { ability } from '@crudui/plugins/casl/ability'
import { useMeStore } from '@crudui/stores/meStore'

interface Props {
  shortMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shortMenu: false,
})

const router = useRouter()
const meStore = useMeStore()
const { t } = useI18n()

const handleLogout = async () => {
  // Вызываем logout из meStore (очищает токены и данные пользователя)
  await meStore.logout()

  // Очищаем CASL правила
  clearAbilityRules()
  ability.update([]) // Очищаем текущие правила

  // Показываем уведомление
  notifications.info(t('common.auth.logoutMessage'))

  // Перенаправляем на страницу логина
  router.push('/login')
}
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ meStore.username || 'qwe@qweq.we' }}
            </VListItemTitle>
            <VListItemSubtitle>{{ meStore.role_title }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <template v-if="!shortMenu">
            <!-- 👉 Profile -->
            <VListItem link :to="{ name: 'profilePage' }">
              <template #prepend>
                <VIcon class="me-2" icon="tabler-user" size="22" />
              </template>

              <VListItemTitle>{{ $t('userProfile.profile') }}</VListItemTitle>
            </VListItem>

            <!-- 👉 Settings -->
<!--            <VListItem link>-->
<!--              <template #prepend>-->
<!--                <VIcon class="me-2" icon="tabler-settings" size="22" />-->
<!--              </template>-->

<!--              <VListItemTitle>{{ $t('userProfile.settings') }}</VListItemTitle>-->
<!--            </VListItem>-->

            <!-- 👉 Pricing -->
            <VListItem link :to="{ name: 'billingHistory' }">
              <template #prepend>
                <VIcon class="me-2" icon="tabler-currency-dollar" size="22" />
              </template>

              <VListItemTitle>{{ $t('userProfile.pricing') }}</VListItemTitle>
            </VListItem>

            <!-- 👉 FAQ -->
<!--            <VListItem link>-->
<!--              <template #prepend>-->
<!--                <VIcon class="me-2" icon="tabler-help" size="22" />-->
<!--              </template>-->

<!--              <VListItemTitle>{{ $t('userProfile.faq') }}</VListItemTitle>-->
<!--            </VListItem>-->

            <!-- Divider -->
            <VDivider class="my-2" />
          </template>

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>{{ $t('common.auth.logout') }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
