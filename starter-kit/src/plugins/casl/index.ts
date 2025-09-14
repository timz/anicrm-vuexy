import type { App } from 'vue'
import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'
import type { Rule } from './ability'

export default function (app: App) {
  // Получаем правила из localStorage (вместо cookie для совместимости с нашей системой)
  const storedRules = localStorage.getItem('userAbilityRules')
  const userAbilityRules: Rule[] = storedRules ? JSON.parse(storedRules) : []

  const initialAbility = createMongoAbility(userAbilityRules)

  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}

// Вспомогательная функция для сохранения правил после авторизации
export function saveAbilityRules(rules: Rule[]) {
  localStorage.setItem('userAbilityRules', JSON.stringify(rules))
}

// Функция для очистки правил при выходе
export function clearAbilityRules() {
  localStorage.removeItem('userAbilityRules')
}
