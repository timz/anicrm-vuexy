# Инструкция по миграции CrudSelector из Quasar в Vuetify

## Описание исходного компонента
**tmp/CrudSelector.vue** - универсальный компонент селектора из проекта на Quasar Framework, который необходимо адаптировать для использования с Vuetify 3 в проекте starter-kit.

## Основная функциональность для сохранения

### 1. Источники данных
- **Статические данные**: через проп `dataOptions` (массив опций)
- **Динамическая загрузка**: через проп `dataUrl` (POST-запрос к API)
- Структура опций: `{ value: any, label: string }`

### 2. Режимы работы
- Одиночный выбор (по умолчанию)
- Множественный выбор с отображением чипсов (`multiple: true`)
- Поиск и фильтрация с debounce 300мс
- Очистка выбранного значения (clearable)

### 4. API-запросы
- POST-запрос на `dataUrl` с телом:
  ```json
  {
    "filter": {
      "filterStr": "поисковая строка",
      "id": "текущее значение поля",
      ...extraRequestData
    }
  }
  ```
- Ответ ожидается в формате: `{ data: { result: { list: [...] } } }`
- Использует `secureApi` из AxiosService



## План миграции

### Шаг 1: Замена UI-компонента
**Из Quasar:**
```vue
<q-select
  outlined
  dense
  clearable
  hideBottomSpace
  bg-color="white"
  options-dense
  emit-value
  map-options
  ...
/>
```

**В Vuetify:**
```vue
<v-autocomplete
  variant="outlined"
  density="compact"
  clearable
  hide-details="auto"
  bg-color="surface"
  item-title="label"
  item-value="value"
  return-object="false"
  ...
/>
```

### Шаг 2: Адаптация пропсов

| Quasar проп | Vuetify эквивалент | Примечание |
|------------|-------------------|------------|
| `outlined` | `variant="outlined"` | Стиль обводки |
| `dense` | `density="compact"` | Компактный размер |
| `use-chips` + `multiple` | `chips` + `multiple` | Множественный выбор с чипсами |
| `hideBottomSpace` | `hide-details="auto"` | Скрытие подсказок |
| `use-input` | встроено в v-autocomplete | Поиск по вводу |
| `options-dense` | `density="compact"` на items | Плотность опций |
| `emit-value` + `map-options` | `return-object="false"` | Возврат значения, а не объекта |
| `input-debounce` | реализовать через `@update:search` | Задержка поиска |
| `@filter` | `@update:search` | Обработчик фильтрации |

### Шаг 3: Сохранение бизнес-логики

1. **Метод getList()** - оставить без изменений, только адаптировать импорты:
   ```javascript
   import { secureApi } from '@/services/AxiosService'
   ```

2. **Фильтрация onFilter()** - адаптировать под Vuetify:
   ```javascript
   // Quasar
   @filter="onFilter"

   // Vuetify
   @update:search="onSearch"
   :filter-mode="customFilter"
   ```

3. **FormProvider** - сохранить логику инжектирования и использования

### Шаг 4: Структура файлов

Разместить компонент в:
```
starter-kit/src/crudui/components/Inputs/CrudSelector.vue
```

### Шаг 5: Адаптация импортов

**Старые импорты (Quasar):**
```javascript
import { secureApi } from '@crud/services/AxiosService'
import type { CrudSelectorOptionsList } from '@crud/components/Inputs/interfaces/CrudSelectorOptionInterface'
import type { FormProvider } from '@crud/providers/form/FormProvider'
import { useDisableForm } from '@crud/components/data/helpers/useDisableForm'
```

**Новые импорты (Vuetify):**
```javascript
import { secureApi } from '@/services/AxiosService'
// Типы нужно будет создать или найти аналоги в starter-kit
// FormProvider нужно найти или адаптировать из spa-vuetify
// useDisableForm нужно найти или создать аналог
```

## Проверочный чек-лист

- [ ] Компонент корректно отображается в Vuetify стилях
- [ ] Работает загрузка данных из статического массива
- [ ] Работает загрузка данных с сервера
- [ ] Работает фильтрация/поиск с debounce
- [ ] Работает одиночный выбор
- [ ] Работает множественный выбор с чипсами
- [ ] Корректно интегрируется с FormProvider
- [ ] Валидация через rules работает
- [ ] Очистка значения работает

## Важные замечания

1. **НЕ ИЗМЕНЯТЬ бизнес-логику** - только адаптировать под новый UI-фреймворк
2. **Сохранить все функциональные возможности** оригинального компонента
3. **Использовать существующие сервисы** из starter-kit (AxiosService, система уведомлений)
4. **Следовать архитектуре starter-kit** при размещении файлов и импортах
5. **Проверить совместимость** с существующими формами в starter-kit