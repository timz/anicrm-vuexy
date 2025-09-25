<template>
  <div class="q-px-lg q-pt-sm q-mx-auto" style="max-width: 1280px;">

    <!-- Промо-баннер -->
    <div class="promo-banner">
      <div class="promo-icon">🎁</div>
      <div class="promo-content">
        <div class="text-h5">Получите скидку 50% на первый месяц.</div>
        <p>Оплатите в течение 14-дневного пробного периода, чтобы получить эту скидку.</p>
      </div>
    </div>

    <!-- Переключатель периодов -->
    <div class="period-selector">
      <q-btn-toggle
        v-model="selectedPeriod"

        no-wrap
        rounded
        toggle-color="primary"
        :options="[
          { label: '1 год', value: '1year' },
          { label: '1 месяц', value: '1month' }
        ]"
      />
    </div>

    <!-- Карточки тарифных планов -->
    <div class="plans-grid">

      <!-- personal план -->
      <q-card class="plan-card personal-plan">
        <q-card-section class="plan-header">
          <div class="plan-title">
            <h3>Персональный</h3>
            <q-icon name="local_fire_department" size="sm" color="red" />
          </div>

        </q-card-section>

        <q-card-section class="plan-pricing">
          <div class="price">
            <span v-if="plans.personal.discount > 0" class="old-price">{{ plans.personal.oldPrice[selectedPeriod === '1year' ? 'year' : 'month'].toFixed(2).replace('.', ',') }} ₽</span>
            <span v-if="plans.personal.discount > 0" class="discount">-{{ plans.personal.discount }}%</span>
            <span class="current-price">{{ plans.personal.newPrice[selectedPeriod === '1year' ? 'year' : 'month'].toFixed(2).replace('.', ',') }} ₽</span>
            <span class="price-period">/ в {{ selectedPeriod === '1year' ? 'год' : 'месяц' }}</span>
          </div>
          <p class="payment-info">Оплата каждый {{ selectedPeriod === '1year' ? 'год' : 'месяц' }}</p>
        </q-card-section>

        <q-card-section class="plan-action">
          <q-btn
            v-if="plans.personal.tryButton"
            color="green"
            label="Попробовать сейчас"
            class="plan-btn"
          />
          <q-btn
            v-else
            color="green"
            label="Выбрать"
            class="plan-btn"
          />
          <p v-if="plans.personal.tryButton" class="trial-info">14 дней бесплатный тест</p>
        </q-card-section>

        <q-card-section class="plan-features">
          <h4>Доступные функции:</h4>
          <div class="features-list">
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Неограниченные заказы</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>1 пользователь приложения</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>5 подключенных исполнителей</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Базовая аналитика</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- professional план -->
      <q-card class="plan-card professional-plan">
        <div class="plan-badge">Популярный</div>
        <q-card-section class="plan-header">
          <div class="plan-title">
            <h3>Профессиональный</h3>
            <q-icon name="star" size="sm" color="purple" />
          </div>
        </q-card-section>

        <q-card-section class="plan-pricing">
          <div class="price">
            <span v-if="plans.professional.discount > 0" class="old-price">{{ plans.professional.oldPrice[selectedPeriod === '1year' ? 'year' : 'month'].toFixed(2).replace('.', ',') }} ₽</span>
            <span v-if="plans.professional.discount > 0" class="discount">-{{ plans.professional.discount }}%</span>
            <span class="current-price">{{ plans.professional.newPrice[selectedPeriod === '1year' ? 'year' : 'month'].toFixed(2).replace('.', ',') }} ₽</span>
            <span class="price-period">/ в {{ selectedPeriod === '1year' ? 'год' : 'месяц' }}</span>
          </div>
          <p class="payment-info">Оплата каждый {{ selectedPeriod === '1year' ? 'год' : 'месяц' }}</p>
        </q-card-section>

        <q-card-section class="plan-action">
          <q-btn
            v-if="plans.professional.tryButton"
            color="green"
            label="Попробовать сейчас"
            class="plan-btn"
          />
          <q-btn
            v-else
            color="green"
            label="Выбрать"
            class="plan-btn"
          />
          <p v-if="plans.professional.tryButton" class="trial-info">14 дней бесплатный тест</p>
        </q-card-section>

        <q-card-section class="plan-features">
          <h4>Всё из Персонального, плюс:</h4>
          <div class="features-list">
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>До 3 пользователей приложения</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>до 20 подключенных исполнителей</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Продвинутая аналитика</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Приоритетная поддержка клиентов</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Exclusive план -->
      <q-card class="plan-card exclusive-plan">
        <q-card-section class="plan-header">
          <div class="plan-title">
            <h3>Эксклюзивный</h3>
            <q-icon name="military_tech" size="sm" color="orange" />
          </div>
          <p class="plan-description">Индивидуальные решения и VIP-поддержка для вашего бизнеса.</p>
        </q-card-section>

        <q-card-section class="plan-pricing">
          <div class="contact-pricing">
            <h3>Свяжитесь с нами</h3>
          </div>
        </q-card-section>

        <q-card-section class="plan-action">
          <q-btn
            v-if="plans.exclusive.tryButton"
            color="green"
            label="Попробовать сейчас"
            class="plan-btn"
          />
          <q-btn
            v-else
            outline
            dark
            label="Связаться с нами"
            class="plan-btn"
          />
          <p v-if="plans.exclusive.tryButton" class="trial-info">14 дней бесплатный тест</p>
        </q-card-section>

        <q-card-section class="plan-features">
          <h4>Всё из Профессионального, плюс</h4>
          <div class="features-list">
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Неограниченное количество пользователей</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Продвинутая безопасность</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Пользовательские интеграции</span>
            </div>
            <div class="feature-item">
              <q-icon name="check" color="green" />
              <span>Личный менеджер</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="page-footer">
      <p>Для регистрации кредитная карта не требуется. Пробный период заканчивается автоматически, без автосписания. Цены указаны без НДС.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setPageTitle } from '@crud/services/PageService'

const selectedPeriod = ref('1year')

// Тарифы с ценами
const plans = {
  personal: {
    oldPrice: { year: 3000.54, month: 5000.54 },
    newPrice: { year: 1500.27, month: 2500.27 },
    discount: 50,
    tryButton: true
  },
  professional: {
    oldPrice: { year: 3152.02, month: 3152.02 },
    newPrice: { year: 1576.01, month: 1576.01 },
    discount: 50,
    tryButton: true
  },
  exclusive: {
    oldPrice: { year: 0, month: 0 },
    newPrice: { year: 0, month: 0 },
    discount: 0,
    tryButton: false
  }
}

onMounted(() => {
  setPageTitle('Выберите свой план')
})
</script>

<style scoped>


.promo-banner{
  position: relative;
  color: #fff;
  background-image: linear-gradient(45deg,#4A148C,#C2185B,#E53935);
  background-size: 180% 180%;
  animation: promoShift 16s ease-in-out infinite;
  border-radius: 18px;
  overflow: hidden;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  border: none;
}
.promo-banner::after{
  content:"";
  position:absolute; inset:0;
  background: linear-gradient(120deg, rgba(0,0,0,.22), rgba(0,0,0,.06));
  mix-blend-mode: multiply;
  pointer-events:none;
}
@keyframes promoShift{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@media (prefers-reduced-motion: reduce){
  .promo-banner{ animation:none; }
}

.promo-icon {
  font-size: 48px;
  margin-right: 20px;
}

.promo-content h3 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 18px;
}

.promo-content p {
  margin: 0;
  color: #fff;
  font-size: 14px;
}

.period-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}



.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.plan-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  position: relative;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.plan-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #7c3aed;
  color: white;
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.personal-plan {
  border: 2px solid #ef4444;
}

.professional-plan {
  border: 2px solid #7c3aed;
}

.exclusive-plan {
  background: #f5f5f5;
  color: #1a1a1a;
}

.plan-header {
  padding: 20px 20px 0 20px;
}

.plan-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.plan-title h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.plan-description {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.exclusive-plan .plan-description {
  color: #6c757d;
}

.plan-pricing {
  padding: 20px;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 5px;
}

.old-price {
  font-size: 14px;
  text-decoration: line-through;
  color: #6c757d;
}

.discount {
  background: #ef4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.current-price {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
}

.exclusive-plan .current-price {
  color: #1a1a1a;
}

.price-period {
  font-size: 14px;
  color: #6c757d;
}

.payment-info {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
}

.contact-pricing h3 {
  margin: 0;
  font-size: 20px;
  color: #1a1a1a;
}

.plan-action {
  padding: 0 20px 20px 20px;
}

.plan-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
}

.trial-info {
  margin: 10px 0 0 0;
  font-size: 12px;
  text-align: center;
  color: #6c757d;
}

.plan-features {
  padding: 0 20px 20px 20px;
  border-top: 1px solid #dee2e6;
}

.exclusive-plan .plan-features {
  border-top-color: #dee2e6;
}


.plan-features h4 {
  margin: 20px 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.feature-item span {
  color: #1a1a1a;
}

.page-footer {
  text-align: center;
  padding: 20px;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }

  .promo-banner {
    flex-direction: column;
    text-align: center;
  }

  .promo-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>

