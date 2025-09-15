# Промпт для агента миграции структуры starter-kit/src в crudui

## Задача

Выполнить реструктуризацию проекта starter-kit, переместив основную бизнес-логику в папку crudui для централизации и
устранения дублирования кода.

## Контекст

Проект starter-kit содержит дублирующийся функционал в папках src/ и src/crudui/. Необходимо объединить эти части,
оставив в корне src/ только UI-компоненты Vuexy шаблона.

## Текущая структура проекта

### Дублирующиеся файлы (требуют объединения):

```
src/services/AxiosService.ts → crudui/services/AxiosService.ts (уже существует)
src/services/EnvService.ts → crudui/services/EnvService.ts (уже существует)
src/services/notification.ts → crudui/boot/notification.ts (уже существует)
src/stores/meStore.ts → crudui/stores/meStore.ts (уже существует)
src/interfaces/ResponseDto.ts → crudui/interfaces/ResponseDto.ts (уже существует)
src/composables/useGlobalLoading.ts → crudui/composables/useGlobalLoading.ts (нужно создать)
src/composables/useNotifications.ts → crudui/composables/useNotifications.ts (нужно создать)
```

### Файлы для переноса без изменений:

```
src/utils/* → crudui/utils/*
src/router/* → crudui/router/*
```

### Остаются на месте (часть Vuexy шаблона):

```
src/@core/* - системные компоненты Vuexy
src/@layouts/* - компоненты макетов Vuexy
src/plugins/* - плагины приложения
src/assets/* - стили и изображения
src/pages/* - страницы приложения
src/modules/* - бизнес-модули
src/components/* - UI компоненты
src/layouts/* - макеты страниц
```

## Пошаговая инструкция

### Шаг 1: Анализ дублирующихся файлов

1. Сравнить содержимое файлов:
    - `src/services/AxiosService.ts` vs `crudui/services/AxiosService.ts`
    - `src/services/EnvService.ts` vs `crudui/services/EnvService.ts`
    - `src/stores/meStore.ts` vs `crudui/stores/meStore.ts`
2. Определить различия и решить, какую версию оставить или как объединить

### Шаг 2: Перенос composables

1. Переместить `src/composables/useGlobalLoading.ts` → `crudui/composables/useGlobalLoading.ts`
2. Переместить `src/composables/useNotifications.ts` → `crudui/composables/useNotifications.ts`
3. Обновить импорты в этих файлах:
    - Заменить `@/services/notification` на `@crud/boot/notification`
    - Заменить другие импорты на соответствующие @crud пути

### Шаг 3: Перенос utils

1. Переместить все файлы из `src/utils/` в `crudui/utils/`
2. Обновить импорты внутри перенесенных файлов

### Шаг 4: Перенос router

1. Переместить файлы из `src/router/` в `crudui/router/`
2. Обновить импорты:
    - Заменить `@/stores/meStore` на `@crud/stores/meStore`
    - Заменить `@/services/*` на `@crud/services/*`

### Шаг 5: Удаление дублирующихся файлов

1. Удалить `src/services/AxiosService.ts`
2. Удалить `src/services/EnvService.ts`
3. Удалить `src/services/notification.ts`
4. Удалить `src/stores/meStore.ts`
5. Удалить `src/interfaces/ResponseDto.ts`
6. Удалить папки `src/composables/`, `src/utils/`, `src/router/` если они пустые

### Шаг 6: Обновление импортов во всем проекте

Найти и заменить во всех файлах проекта:

```
@/services/AxiosService → @crud/services/AxiosService
@/services/EnvService → @crud/services/EnvService
@/services/notification → @crud/boot/notification
@/stores/meStore → @crud/stores/meStore
@/interfaces/ResponseDto → @crud/interfaces/ResponseDto
@/composables/useGlobalLoading → @crud/composables/useGlobalLoading
@/composables/useNotifications → @crud/composables/useNotifications
@/utils/ → @crud/utils/
@/router → @crud/router
```

### Шаг 7: Обновление экспортов в crudui

Убедиться, что все перенесенные модули правильно экспортируются из crudui для использования в других частях приложения.

### Шаг 8: Проверка и тестирование

1. Запустить `pnpm run typecheck` для проверки типов
2. Запустить `pnpm run lint` для проверки стиля кода
3. Запустить `pnpm run dev` и проверить, что приложение работает
4. Проверить основные функции:
    - Авторизация
    - Навигация
    - CRUD операции
    - Уведомления
    - Глобальная загрузка

## Важные замечания

1. **НЕ ИЗМЕНЯТЬ** файлы в папках @core и @layouts - это часть Vuexy шаблона
2. **СОХРАНИТЬ** все импорты из `@core/*` и `@layouts/*` как есть
3. **ПРОВЕРИТЬ** что алиасы `@crud` и `@crudui` настроены в vite.config.ts (уже настроены)
4. **НЕ УДАЛЯТЬ** папку src/services полностью, если там есть другие сервисы кроме перечисленных
5. **ОСТОРОЖНО** с файлами, которые импортируются из spa-vuetify - они не должны быть затронуты

## Ожидаемый результат

После миграции структура должна быть:

```
starter-kit/src/
├── @core/          (без изменений - Vuexy)
├── @layouts/       (без изменений - Vuexy)
├── assets/         (без изменений)
├── components/     (без изменений)
├── crudui/         (вся бизнес-логика)
│   ├── boot/
│   ├── components/
│   ├── composables/ (+ новые из src/composables)
│   ├── interfaces/
│   ├── layouts/
│   ├── providers/
│   ├── router/     (+ перенесенные из src/router)
│   ├── services/
│   ├── stores/
│   ├── utils/      (+ перенесенные из src/utils)
│   └── types.ts
├── i18n/           (без изменений)
├── layouts/        (без изменений)
├── modules/        (без изменений)
├── pages/          (без изменений)
├── plugins/        (без изменений)
├── App.vue
└── main.ts
```

Все импорты должны использовать алиас `@crudui/` для обращения к бизнес-логике.