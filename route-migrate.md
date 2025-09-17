# Миграция системы роутинга в starter-kit

## Задача
Необходимо модифицировать систему роутинга в starter-kit, взяв лучшие практики из spa-vuetify и современного подхода starter-kit.

## Текущее состояние

### spa-vuetify (источник бизнес-логики):
- Роутер в `spa-vuetify/src/router/index.ts`
- Динамический импорт модульных роутов через `import.meta.glob('../modules/*/routes.ts')`
- Все модульные роуты добавляются плоско в родительский роут с `CleanLayout`
- Проверка прав через `meStore.userCanRoute()` и `meStore.userCan()`
- Загрузка данных пользователя и прав с сервера через `meStore.loadMe()`
- Проверка оплаты подписки организации

### starter-kit (целевая директория):
- Роутер в `starter-kit/src/crudui/plugins/2.router/index.ts`
- Автогенерация роутов из `src/crudui/pages/` через `unplugin-vue-router`
- Layouts через `virtual:meta-layouts`
- CASL для проверки прав через `canNavigate()`
- Модульные роуты в `src/modules/*/routes.ts` существуют, но НЕ подключаются

## Требования к реализации

### 1. Динамический импорт модульных роутов
- В файле `starter-kit/src/crudui/plugins/2.router/index.ts` добавить динамический импорт всех `routes.ts` из модулей
- Использовать `import.meta.glob('../../modules/*/routes.ts', { eager: true })`
- Добавлять роуты через `router.addRoute()` после создания роутера
- Все модульные роуты добавлять плоско (без иерархии)
- УДАЛИТЬ старый механизм автогенерации из pages, если он конфликтует

### 2. Layouts через virtual:meta-layouts
- Оставить текущий механизм layouts в starter-kit (через `virtual:meta-layouts`)
- В модульных роутах указывать layout через meta.layout
- Убрать явное указание компонентов layouts из роутов (как было в spa-vuetify)

### 3. Система проверки прав через CASL с загрузкой правил с сервера

#### 3.1. Создать meStore (аналог из spa-vuetify)
Создать файл `starter-kit/src/crudui/stores/meStore.ts` с функционалом:
- `loadMe()` - загрузка данных пользователя и CASL правил с сервера
- `logout()` - выход из системы
- Поля: `loaded`, `user`, `org_not_paid_block`
- **ВСЕ проверки прав делегировать CASL (не хранить permissions отдельно)**

#### 3.2. Модифицировать beforeEach в роутере
В `starter-kit/src/crudui/plugins/2.router/index.ts`:
- Добавить проверку загрузки данных пользователя через `meStore.loadMe()`
- **Использовать CASL `canNavigate(route)` для проверки доступа к роутам**
- Добавить проверку оплаты подписки организации
- Сохранить список свободных роутов (login, logout, error страницы)

#### 3.3. Полная интеграция с CASL
- При загрузке данных пользователя с сервера получать CASL rules
- Использовать существующий механизм `saveAbilityRules()` из starter-kit
- **ВСЕ проверки прав в приложении делать через CASL ability:**
  - В роутере: `canNavigate(route)`
  - В компонентах: `ability.can('action', 'subject')`
  - В composables: `useAbility()` из starter-kit
- **НЕ дублировать логику проверки прав в meStore**

### 4. Структура модульных роутов
Каждый модуль должен экспортировать массив роутов типа `TCrudRouteRecord[]`:
```typescript
export default <TCrudRouteRecord[]>[
  {
    path: '/module-path',
    name: 'moduleName',
    component: () => import('./components/IndexPage.vue'),
    meta: {
      layout: 'default', // для virtual:meta-layouts
      // Для CASL проверки доступа к роуту:
      action: 'view', // CASL action
      subject: 'Module', // CASL subject
      // ИЛИ старый формат (нужно будет конвертировать в CASL):
      permission: 'module_permission',

      title: 'Заголовок страницы',
      menuTitle: 'Название в меню',
      menuIcon: 'mdi-icon',
      menuSort: 10,
      menuHide: false,
    },
  },
]
```

**Важно**: Если в роутах используется старый формат `permission`, нужно конвертировать его в CASL формат `action/subject` при проверке прав.

### 5. Очистка
- УДАЛИТЬ автогенерацию роутов из pages в vite.config.ts, если она больше не нужна
- УДАЛИТЬ неиспользуемые страницы из `src/crudui/pages/`
- Оставить только системные страницы (login, errors, not-authorized)

## Файлы для изменения

1. `starter-kit/src/crudui/plugins/2.router/index.ts` - основная логика роутера
2. `starter-kit/src/crudui/stores/meStore.ts` - создать новый store
3. `starter-kit/src/crudui/interfaces/CrudRouterInterface.ts` - проверить/обновить интерфейсы
4. `starter-kit/vite.config.ts` - возможно, удалить/изменить конфигурацию unplugin-vue-router
5. Модульные `routes.ts` файлы - обновить meta.layout

## Важные моменты

1. **Бизнес-логика из spa-vuetify должна быть перенесена полностью**:
   - Логика проверки оплаты подписки
   - Список свободных роутов
   - Редиректы при отсутствии прав
   - **НО проверку прав делать через CASL, а не через старый механизм**

2. **CASL - единая точка управления правами**:
   - ВСЕ проверки прав только через CASL ability
   - НЕ создавать отдельные методы проверки прав в meStore
   - Использовать существующие CASL composables и helpers из starter-kit
   - При загрузке пользователя обновлять CASL rules

3. **Сохранить современные подходы starter-kit**:
   - virtual:meta-layouts для layouts
   - CASL для управления правами (полностью)
   - TypeScript типизация
   - Существующие composables для CASL

4. **НЕ добавлять ничего от себя** - только перенос существующей логики с адаптацией под CASL

## Проверка результата

После реализации должно работать:
1. Все модульные роуты из `src/modules/*/routes.ts` автоматически подключаются
2. При переходе на защищенные страницы проверяются права через CASL
3. Неавторизованные пользователи перенаправляются на login
4. При отсутствии прав (проверка через CASL) показывается страница not-authorized
5. При неоплаченной подписке показывается соответствующая страница ошибки
6. В компонентах можно использовать `ability.can()` и `v-can` директиву для проверки прав на элементы интерфейса
7. CASL rules загружаются с сервера при авторизации и сохраняются локально