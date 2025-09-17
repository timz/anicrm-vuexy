# Миграция системы роутинга в starter-kit

## Задача
Интегрировать существующую систему роутинга из spa-vuetify (которая уже частично перенесена) с современным подходом starter-kit, используя CASL для всех проверок прав доступа.

**ВАЖНО**: В starter-kit уже есть два роутера и meStore - нужно их объединить и модернизировать.

## Текущее состояние

### spa-vuetify (источник бизнес-логики):
- Роутер в `spa-vuetify/src/router/index.ts`
- Динамический импорт модульных роутов через `import.meta.glob('../modules/*/routes.ts')`
- Все модульные роуты добавляются плоско в родительский роут с `CleanLayout`
- Проверка прав через `meStore.userCanRoute()` и `meStore.userCan()`
- Загрузка данных пользователя и прав с сервера через `meStore.loadMe()`
- Проверка оплаты подписки организации

### starter-kit (целевая директория - УЖЕ ПЕРЕНЕСЕНО):
- **Роутер УЖЕ ПЕРЕНЕСЕН** в `starter-kit/src/crudui/router/index.ts` (копия из spa-vuetify)
- **meStore УЖЕ ПЕРЕНЕСЕН** в `starter-kit/src/crudui/stores/meStore.ts` (копия из spa-vuetify)
- **Динамический импорт модульных роутов УЖЕ РАБОТАЕТ**
- Роутер в плагинах `starter-kit/src/crudui/plugins/2.router/index.ts` - другая версия с CASL
- Автогенерация роутов из `src/crudui/pages/` через `unplugin-vue-router`
- Layouts через `virtual:meta-layouts`

## Требования к реализации

### 1. Объединение двух версий роутера
**ПРОБЛЕМА**: В starter-kit есть ДВА роутера:
- `src/crudui/router/index.ts` - перенесенный из spa-vuetify (с meStore проверками)
- `src/crudui/plugins/2.router/index.ts` - современный с CASL и virtual:meta-layouts

**РЕШЕНИЕ**:
- Использовать роутер из плагинов как основу (`src/crudui/plugins/2.router/index.ts`)
- Взять динамический импорт модулей из `src/crudui/router/index.ts`
- Удалить дублирующийся роутер `src/crudui/router/index.ts`

### 2. Layouts через virtual:meta-layouts
- Оставить текущий механизм layouts в starter-kit (через `virtual:meta-layouts`)
- В модульных роутах указывать layout через meta.layout
- Убрать явное указание компонентов layouts из роутов (как было в spa-vuetify)

### 3. Система проверки прав через CASL с загрузкой правил с сервера

#### 3.1. Модифицировать существующий meStore
**meStore УЖЕ СУЩЕСТВУЕТ** в `starter-kit/src/crudui/stores/meStore.ts` и содержит:
- `loadMe()` - загрузка данных пользователя с сервера
- `userCanRoute()` и `userCan()` - проверки прав через permissions
- `logout()` - выход из системы
- Построение меню на основе прав

**НУЖНО ИЗМЕНИТЬ**:
- Заменить проверки `userCanRoute()` и `userCan()` на CASL
- При загрузке в `loadMe()` сохранять CASL rules через `saveAbilityRules()`
- Удалить хранение `permissions` или конвертировать их в CASL rules

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

### 5. Очистка и рефакторинг
- УДАЛИТЬ дублирующийся роутер `src/crudui/router/index.ts`
- ПЕРЕНЕСТИ `freeRoutes` и `menuGroups` в нужное место
- УДАЛИТЬ автогенерацию роутов из pages в vite.config.ts
- УДАЛИТЬ неиспользуемые страницы из `src/crudui/pages/`
- Оставить только системные страницы (login, errors, not-authorized)

## Файлы для изменения

1. **ГЛАВНЫЙ**: `starter-kit/src/crudui/plugins/2.router/index.ts` - добавить динамический импорт модулей и проверки из meStore
2. `starter-kit/src/crudui/stores/meStore.ts` - интегрировать с CASL
3. `starter-kit/src/crudui/plugins/casl/index.ts` - добавить методы конвертации permissions в CASL rules
4. **УДАЛИТЬ**: `starter-kit/src/crudui/router/index.ts` - дублирующийся роутер
5. `starter-kit/vite.config.ts` - удалить/изменить конфигурацию unplugin-vue-router
6. Модульные `routes.ts` файлы - обновить meta.layout при необходимости

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