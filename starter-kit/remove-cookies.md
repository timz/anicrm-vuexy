# Инструкции по удалению куки из проекта starter-kit

## Цель
Полностью удалить использование куки из проекта starter-kit. Все места, где берутся данные из куки, должны быть заменены на дефолтные значения из конфигурации.

## ВАЖНО
- Работаем ТОЛЬКО в директории `starter-kit/src/crudui/`
- НЕ трогаем файлы в `full-version/` или `spa-vuetify/`
- Все дефолтные значения берем из `themeConfig.ts` и `layoutConfig`

## Файлы для изменения

### 1. `src/crudui/@core/stores/config.ts`
**Текущее состояние:** Использует `cookieRef` для хранения настроек темы
**Изменения:**
```typescript
// Удалить импорт
import { cookieRef, useLayoutConfigStore } from '@crudui/components/templates/stores/config'

// Заменить на
import { useLayoutConfigStore } from '@crudui/components/templates/stores/config'

// Заменить все cookieRef на ref с дефолтными значениями:
const cookieColorScheme = cookieRef<'light' | 'dark'>('color-scheme', 'light')
// заменить на
const cookieColorScheme = ref<'light' | 'dark'>('light')

const theme = cookieRef('theme', themeConfig.app.theme)
// заменить на
const theme = ref(themeConfig.app.theme)

const isVerticalNavSemiDark = cookieRef('isVerticalNavSemiDark', themeConfig.verticalNav.isVerticalNavSemiDark)
// заменить на
const isVerticalNavSemiDark = ref(themeConfig.verticalNav.isVerticalNavSemiDark)

const skin = cookieRef('skin', themeConfig.app.skin)
// заменить на
const skin = ref(themeConfig.app.skin)
```

### 2. `src/crudui/components/templates/stores/config.ts`
**Текущее состояние:** Экспортирует `cookieRef` функцию и использует её для настроек макета
**Изменения:**
```typescript
// Удалить функцию cookieRef полностью
export const cookieRef = <T>(key: string, defaultValue: T) => {
  return useCookie<T>(namespaceConfig(key), { default: () => defaultValue })
}

// В useLayoutConfigStore заменить все cookieRef на ref:
const isNavbarBlurEnabled = cookieRef('isNavbarBlurEnabled', layoutConfig.navbar.navbarBlur)
// заменить на
const isNavbarBlurEnabled = ref(layoutConfig.navbar.navbarBlur)

const isVerticalNavCollapsed = cookieRef('isVerticalNavCollapsed', layoutConfig.verticalNav.isVerticalNavCollapsed)
// заменить на
const isVerticalNavCollapsed = ref(layoutConfig.verticalNav.isVerticalNavCollapsed)

const appContentWidth = cookieRef('appContentWidth', layoutConfig.app.contentWidth)
// заменить на
const appContentWidth = ref(layoutConfig.app.contentWidth)
```

### 3. `src/crudui/@core/components/TheCustomizer.vue`
**Текущее состояние:** Использует `cookieRef` для хранения кастомных цветов темы
**Изменения:**
```typescript
// Удалить импорт
import { cookieRef, namespaceConfig } from '@crudui/components/templates/stores/config'
// Заменить на
import { namespaceConfig } from '@crudui/components/templates/stores/config'

// Удалить или закомментировать все строки с cookieRef:
const cookiePrimaryColor = cookieRef(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value
// заменить на
const cookiePrimaryColor = null

cookieRef<string | null>(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value = color.main
// удалить эту строку

cookieRef<string | null>(`${vuetifyTheme.name.value}ThemePrimaryDarkenColor`, null).value = color.darken
// удалить эту строку

// В функции resetCustomizer удалить все строки с cookieRef:
cookieRef('lightThemePrimaryColor', null).value = null
cookieRef('darkThemePrimaryColor', null).value = null
cookieRef('lightThemePrimaryDarkenColor', null).value = null
cookieRef('darkThemePrimaryDarkenColor', null).value = null
// Все эти строки удалить
```

### 4. `src/crudui/@core/initCore.ts`
**Текущее состояние:** Использует `cookieRef` для хранения языка
**Изменения:**
```typescript
// Удалить импорт cookieRef
import { cookieRef, namespaceConfig } from '@crudui/components/templates/stores/config'
// Заменить на
import { namespaceConfig } from '@crudui/components/templates/stores/config'

// Заменить
const storedLang = cookieRef<string | null>('language', null)
// на
const storedLang = ref<string | null>(null)
```

### 5. `src/crudui/@core/utils/vuetify.ts`
**Текущее состояние:** Использует `cookieRef` для определения темы
**Изменения:**
```typescript
// Удалить импорт
import { cookieRef } from '@crudui/components/templates/stores/config'

// Заменить функцию resolveVuetifyTheme:
export const resolveVuetifyTheme = (defaultTheme: LiteralUnion<'light' | 'dark' | 'system', string>): 'light' | 'dark' => {
  const cookieColorScheme = cookieRef<'light' | 'dark'>('color-scheme', usePreferredDark().value ? 'dark' : 'light')
  const storedTheme = cookieRef('theme', defaultTheme).value

  return storedTheme === 'system'
    ? cookieColorScheme.value
    : storedTheme as 'light' | 'dark'
}

// на
export const resolveVuetifyTheme = (defaultTheme: LiteralUnion<'light' | 'dark' | 'system', string>): 'light' | 'dark' => {
  const preferredDark = usePreferredDark().value
  const storedTheme = defaultTheme

  return storedTheme === 'system'
    ? (preferredDark ? 'dark' : 'light')
    : storedTheme as 'light' | 'dark'
}
```

### 6. `src/crudui/plugins/vuetify/index.ts`
**Текущее состояние:** Использует `cookieRef` для цветов темы
**Изменения:**
```typescript
// Удалить импорт
import { cookieRef } from '@crudui/components/templates/stores/config'

// Заменить в настройках тем:
'primary': cookieRef('lightThemePrimaryColor', staticPrimaryColor).value,
// на
'primary': staticPrimaryColor,

'primary-darken-1': cookieRef('lightThemePrimaryDarkenColor', staticPrimaryDarkenColor).value,
// на
'primary-darken-1': staticPrimaryDarkenColor,

// То же самое для dark темы:
'primary': cookieRef('darkThemePrimaryColor', staticPrimaryColor).value,
// на
'primary': staticPrimaryColor,

'primary-darken-1': cookieRef('darkThemePrimaryDarkenColor', staticPrimaryDarkenColor).value,
// на
'primary-darken-1': staticPrimaryDarkenColor,
```

### 7. `src/crudui/@core/components/cards/AppCardCode.vue`
**Текущее состояние:** Использует `useCookie` для предпочитаемого языка кода
**Изменения:**
```typescript
const preferredCodeLanguage = useCookie<CodeLanguages>('preferredCodeLanguage', {
  default: () => 'ts',
  maxAge: COOKIE_MAX_AGE_1_YEAR,
})

// Заменить на
const preferredCodeLanguage = ref<CodeLanguages>('ts')
```

### 8. `src/crudui/components/templates/helpers/index.ts`
**Текущее состояние:** Использует `cookieRef` при инициализации конфигурации макета
**Изменения:**
```typescript
// Удалить импорт cookieRef
import { cookieRef, useLayoutConfigStore } from '@crudui/components/templates/stores/config'
// Заменить на
import { useLayoutConfigStore } from '@crudui/components/templates/stores/config'

// В функции install заменить все cookieRef на прямые значения:
configStore.$patch({
  appContentLayoutNav: cookieRef('appContentLayoutNav', userConfig.app?.contentLayoutNav ?? layoutConfig.app.contentLayoutNav).value,
  // заменить на
  appContentLayoutNav: userConfig.app?.contentLayoutNav ?? layoutConfig.app.contentLayoutNav,

  appContentWidth: cookieRef('appContentWidth', userConfig.app?.contentWidth ?? layoutConfig.app.contentWidth).value,
  // заменить на
  appContentWidth: userConfig.app?.contentWidth ?? layoutConfig.app.contentWidth,

  // И так далее для всех полей...
})
```

### 9. Удалить файл `src/crudui/@core/composable/useCookie.ts`
Этот файл больше не нужен - удалить полностью.

### 10. `vite.config.ts`
**Текущее состояние:** Игнорирует `useCookies` в автоимпортах
**Изменения:**
```typescript
// Найти и удалить строку
ignore: ['useCookies', 'useStorage'],
// Заменить на
ignore: ['useStorage'],
```

### 11. Обновить автоимпорты
После всех изменений нужно запустить `pnpm run dev` чтобы обновились auto-imports.d.ts

## Дефолтные значения из themeConfig.ts

Для справки, вот основные дефолтные значения:
- `theme`: 'light'
- `skin`: Skins.Default
- `isVerticalNavSemiDark`: true
- `isVerticalNavCollapsed`: false
- `contentWidth`: ContentWidth.Boxed
- `contentLayoutNav`: AppContentLayoutNav.Vertical
- `navbarBlur`: true
- `navbarType`: NavbarType.Sticky
- `footerType`: FooterType.Static
- `language`: 'en' (defaultLocale)

## Проверка после изменений

1. Убедиться, что нигде не осталось импортов `useCookie` или `cookieRef`
2. Запустить `pnpm run dev` и проверить, что приложение работает
3. Проверить, что настройки темы применяются из дефолтных значений
4. Убедиться, что в браузере не создаются новые куки

## Примечание
Эти изменения означают, что настройки пользователя НЕ будут сохраняться между сессиями. Все настройки будут сбрасываться на дефолтные при перезагрузке страницы. Если нужно сохранение настроек, можно использовать localStorage вместо куки.