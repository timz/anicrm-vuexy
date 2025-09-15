# Задание: Миграция структуры из spa-vuetify в starter-kit

## Цель
Полностью реструктурировать папку `starter-kit/src` под архитектуру `spa-vuetify/src`, сохранив при этом минимальную совместимость с Vuexy для UI компонентов.

## КРИТИЧЕСКИ ВАЖНО
- **ВСЕ изменения делаются ТОЛЬКО в starter-kit/**
- **spa-vuetify и full-version - ТОЛЬКО ДЛЯ ЧТЕНИЯ**
- **НЕ добавлять ничего от себя в бизнес-логику**
- **НЕ удалять части бизнес-логики**
- **Бизнес-логика переносится БЕЗ изменений по функциональности**

## Текущая структура spa-vuetify/src:
```
spa-vuetify/src/
├── assets/
├── crudui/
│   ├── boot/
│   ├── components/
│   ├── composables/
│   ├── interfaces/
│   ├── layouts/
│   ├── pages/
│   ├── providers/
│   ├── services/
│   ├── stores/
│   └── types.ts
├── i18n/
├── modules/
│   ├── auth/
│   ├── clients/
│   ├── deals/
│   └── ... (17 модулей)
├── pages/
├── plugins/
├── router/
└── stores/
```

## Целевая структура starter-kit/src:
```
starter-kit/src/
├── @core/         (ОСТАВИТЬ - нужна для Vuexy UI)
├── @layouts/      (ОСТАВИТЬ - нужна для Vuexy макетов)
├── assets/        (перенести из spa-vuetify)
├── crudui/        (создать новую структуру)
│   ├── boot/
│   ├── components/
│   ├── composables/
│   ├── interfaces/
│   ├── layouts/
│   ├── pages/
│   ├── plugins/   (ВАЖНО: перенести сюда плагины)
│   ├── providers/
│   ├── services/
│   ├── stores/
│   └── types.ts
├── i18n/          (перенести из spa-vuetify)
├── modules/       (создать новую структуру)
│   └── ... (все модули из spa-vuetify)
├── pages/         (общие страницы)
├── plugins/       (оставить минимум)
├── router/        (перенести из spa-vuetify)
└── stores/        (перенести из spa-vuetify)
```

## Пошаговый план выполнения:

### Шаг 1: Создание структуры crudui
1. Создать директорию `starter-kit/src/crudui/`
2. Создать все поддиректории: boot, components, composables, interfaces, layouts, pages, plugins, providers, services, stores
3. Скопировать содержимое из `spa-vuetify/src/crudui/` в соответствующие папки
4. Скопировать `types.ts` в корень crudui

### Шаг 2: Перенос плагинов в crudui/plugins
1. Создать `starter-kit/src/crudui/plugins/`
2. Переместить из `starter-kit/src/plugins/` в `starter-kit/src/crudui/plugins/`:
   - `1.router/` → `crudui/plugins/router/`
   - `2.pinia.ts` → `crudui/plugins/pinia.ts`
   - `casl/` → `crudui/plugins/casl/`
   - `iconify/` → `crudui/plugins/iconify/`
   - `vuetify/` → `crudui/plugins/vuetify/`
   - `layouts.ts` → `crudui/plugins/layouts.ts`
   - `webfontloader.ts` → `crudui/plugins/webfontloader.ts`
3. В корневом `starter-kit/src/plugins/` оставить только:
   - `theme.ts` (скопировать из spa-vuetify/src/plugins/theme.ts)
   - `vuetify.ts` (скопировать из spa-vuetify/src/plugins/vuetify.ts)

### Шаг 3: Создание структуры modules
1. Создать директорию `starter-kit/src/modules/`
2. Скопировать все модули из `spa-vuetify/src/modules/`:
   - adv-sources, auth, client-kids, clients, dashboards, deals, equipments, event-types, measures, places, products, rejection-reasons, settings, subscriptions, workers
3. Каждый модуль должен сохранить свою структуру (components/, routes.ts)

### Шаг 4: Перенос остальных папок
1. Скопировать `spa-vuetify/src/i18n/` → `starter-kit/src/i18n/`
2. Скопировать `spa-vuetify/src/router/` → `starter-kit/src/router/`
3. Скопировать `spa-vuetify/src/stores/` → `starter-kit/src/stores/`
4. Объединить `spa-vuetify/src/assets/` с `starter-kit/src/assets/` (сохранить стили Vuexy)
5. Скопировать страницы из `spa-vuetify/src/pages/` → `starter-kit/src/pages/`

### Шаг 5: Обновление конфигурации

#### 5.1 Обновить vite.config.ts
Добавить алиасы:
```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
    '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
    '@crudui': fileURLToPath(new URL('./src/crudui', import.meta.url)),
    '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
    // ... остальные алиасы
  }
}
```

#### 5.2 Обновить tsconfig.json
Добавить пути:
```json
"paths": {
  "@/*": ["./src/*"],
  "@core/*": ["./src/@core/*"],
  "@layouts/*": ["./src/@layouts/*"],
  "@crudui/*": ["./src/crudui/*"],
  "@modules/*": ["./src/modules/*"],
  // ... остальные пути
}
```

#### 5.3 Обновить auto-imports.d.ts конфигурацию
Добавить директории для авто-импорта:
- `'./src/crudui/composables/**'`
- `'./src/crudui/providers/**'`

### Шаг 6: Обновление main.ts
1. Обновить импорты плагинов - теперь они в `@crudui/plugins/`
2. Убедиться, что порядок загрузки плагинов соответствует spa-vuetify

### Шаг 7: Обновление импортов в файлах
После перемещения файлов нужно обновить импорты:
1. Заменить импорты типа `@/plugins/` на `@crudui/plugins/`
2. Добавить алиас `@modules/` для импортов из модулей
3. Добавить алиас `@crudui/` для импортов из crudui

## Важные замечания:

### Сохранить от Vuexy:
- Папки `@core/` и `@layouts/` - они содержат UI компоненты и утилиты Vuexy
- Базовые стили в `assets/styles/` связанные с темой Vuexy
- Конфигурацию Vuetify, которая настроена под тему Vuexy

### Что НЕ трогать:
- `spa-vuetify/` - только читать и копировать
- `full-version/` - только для справки по UI компонентам

### Особенности:
- AxiosService и EnvService уже перенесены в `starter-kit/src/services/`
- При переносе crudui/services/ нужно будет объединить с существующими или заменить
- Система авторизации использует localStorage вместо cookie
- Все HTTP запросы должны использовать `secureApi` или `api` из AxiosService

## Проверка результата:
1. Структура папок должна полностью соответствовать целевой
2. Все импорты должны работать с новыми алиасами
3. Приложение должно запускаться без ошибок
4. Модули должны быть доступны через роутинг

## Команды для проверки:
```bash
cd starter-kit
pnpm install
pnpm run dev
pnpm run typecheck
pnpm run lint
```

Если возникают ошибки типов или импортов - исправить пути и алиасы.