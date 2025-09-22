import validation from './validation.ts'
import errors from './errors.ts'
import common from './common.ts'
import notifications from './notifications.ts'

export default {
  welcome: 'Ласкаво просимо',
  login: 'Вхід',
  logout: 'Вихід',
  save: 'Зберегти',
  cancel: 'Скасувати',
  edit: 'Редагувати',
  delete: 'Видалити',
  add: 'Додати',
  search: 'Пошук',

  // Authentication
  auth: {
    title: 'Вхід',
    username: 'Email або ім\'я користувача',
    password: 'Пароль',
    loginButton: 'Увійти',
    forgotPassword: 'Забули пароль?',
    resetPassword: 'Скинути пароль',
    email: 'Email',
    newPassword: 'Новий пароль',
    confirmPassword: 'Підтвердіть пароль',
    resetButton: 'Скинути пароль',
    backToLogin: 'Назад до входу'
  },

  // Navigation
  navigation: {
    home: 'Головна',
    clients: 'Клієнти',
    deals: 'Угоди',
    places: 'Місця',
    employees: 'Співробітники',
    products: 'Продукти',
    settings: 'Налаштування'
  },

  // Modules
  modules: {
    clients: {
      title: 'Клієнти',
      single: 'Клієнт',
      table: {
        title: 'Назва',
        created: 'Створено',
        edited: 'Зміни',
        mobile: 'Мобільний',
        birthday: 'Дата народження',
        description: 'Нотатки',
        advSource: 'Джерело реклами'
      },
      form: {
        name: 'Назва',
        mobile: 'Мобільний',
        birthday: 'Дата народження',
        advSource: 'Джерело реклами',
        description: 'Нотатки'
      },
      tabs: {
        clientKids: 'Діти клієнта'
      },
      validation: {
        nameRequired: 'Назва обов\'язкова',
        nameMinLength: 'Мінімум 2 символи'
      }
    },
    deals: {
      title: 'Угоди',
      single: 'Угода',
      table: {
        id: 'ID',
        client: 'Клієнт',
        event: 'Захід',
        amount: 'Сума',
        margin: 'Маржа',
        eventDate: 'Дата заходу',
        status: 'Статус',
        contact: 'Контакт',
        created: 'Створено'
      },
      filter: {
        id: 'ID',
        contact: 'Контакт',
        status: 'Статус',
        client: 'Клієнт',
        amount: 'Сума',
        eventType: 'Тип заходу'
      },
      statuses: {
        new: 'Нова',
        inProgress: 'У роботі',
        hot: 'Гаряча',
        cold: 'Холодна',
        closed: 'Закрита',
        cancelled: 'Скасована',
        rejected: 'Відхилена'
      },
      form: {
        title: 'Назва угоди',
        client: 'Клієнт',
        status: 'Статус',
        amount: 'Сума',
        currency: 'Валюта',
        startDate: 'Дата початку',
        closeDate: 'Дата закриття',
        stage: 'Етап',
        probability: 'Вірогідність закриття (%)',
        source: 'Джерело',
        responsible: 'Відповідальний',
        description: 'Опис',
        notes: 'Нотатки'
      },
      currencies: {
        rub: 'Рубль',
        usd: 'Долар США',
        eur: 'Євро'
      },
      stages: {
        lead: 'Лід',
        contact: 'Контакт',
        qualification: 'Кваліфікація',
        proposal: 'Пропозиція',
        negotiation: 'Переговори',
        contract: 'Контракт',
        closed: 'Закрита'
      },
      sources: {
        website: 'Веб-сайт',
        phone: 'Телефон',
        email: 'Email',
        social: 'Соціальні мережі',
        referral: 'Рекомендація',
        advertising: 'Реклама',
        partner: 'Партнер',
        other: 'Інше'
      },
      statusesEdit: {
        new: 'Нова',
        inProgress: 'У роботі',
        won: 'Виграна',
        lost: 'Програна',
        onHold: 'На утриманні'
      }
    },
    dashboards: {
      title: 'Панелі управління'
    },
    workers: {
      title: 'Співробітники',
      single: 'Співробітник',
      table: {
        name: 'ПІБ',
        mobile: 'Телефон',
        isOutside: 'Зовнішній',
        created: 'Створено'
      },
      form: {
        name: 'Ім\'я',
        mobile: 'Мобільний телефон',
        birthday: 'Дата народження',
        medBook: 'Медична книжка',
        sudSprav: 'Довідка про судимість',
        description: 'Опис',
        position: 'Посада',
        isOutside: 'Зовнішній співробітник',
        email: 'Email'
      },
      filter: {
        all: 'Всі',
        yes: 'Так',
        no: 'Ні'
      },
      actions: {
        invite: 'Запросити'
      },
      invite: {
        title: 'Запрошення співробітника',
        email: 'Email співробітника',
        success: 'Запрошення успішно надіслано',
        error: 'Помилка при надсиланні запрошення'
      }
    },
    products: {
      title: 'Продукти',
      single: 'Продукт',
      table: {
        title: 'Назва',
        price: 'Ціна',
        category: 'Категорія',
        created: 'Створено',
        measure: 'Одиниця виміру'
      },
      form: {
        title: 'Назва',
        price: 'Ціна',
        category: 'Категорія',
        description: 'Опис',
        measure: 'Одиниця виміру'
      },
      filter: {
        id: 'Ід',
        title: 'Назва',
        measure: 'Міра'
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи'
      }
    },
    places: {
      title: 'Місця',
      single: 'Місце',
      table: {
        title: 'Назва',
        address: 'Адреса',
        capacity: 'Місткість',
        created: 'Створено',
        isAvailable: 'Доступно',
        workHours: 'Години роботи'
      },
      form: {
        title: 'Назва',
        address: 'Адреса',
        capacity: 'Місткість',
        description: 'Опис',
        isAvailable: 'Доступно',
        workFrom: 'Працює з (година)',
        workTo: 'Працює до (година)'
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи',
        hourRange: 'Година від 0 до 23'
      }
    },
    settings: {
      title: 'Налаштування',
      companyResources: 'Ресурси компанії',
      crm: 'CRM'
    },
    advSources: {
      title: 'Джерела реклами',
      single: 'Джерело реклами',
      table: {
        title: 'Назва'
      },
      form: {
        title: 'Назва'
      },
      validation: {
        titleRequired: 'Назва обов’язкова',
        titleMinLength: 'Мінімум 2 символи'
      }
    },
    clientKids: {
      title: 'Діти клієнтів',
      single: 'Дитина клієнта',
      table: {
        name: 'Ім’я',
        birthday: 'День народження'
      },
      form: {
        name: 'Ім’я',
        sex: 'Стать',
        birthday: 'Дата народження'
      },
      sex: {
        male: 'Хлопчик',
        female: 'Дівчинка'
      }
    },
    equipments: {
      title: 'Обладнання',
      single: 'Обладнання',
      table: {
        title: 'Назва',
        stateId: 'Статус',
        description: 'Опис',
        created: 'Створено',
        edited: 'Змінено'
      },
      form: {
        title: 'Назва',
        stateId: 'Статус',
        description: 'Опис'
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи'
      }
    },
    eventTypes: {
      title: 'Типи подій',
      single: 'Тип події',
      table: {
        title: 'Назва'
      },
      form: {
        title: 'Назва'
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи'
      }
    },
    measures: {
      title: 'Одиниці виміру',
      single: 'Одиниця виміру',
      table: {
        title: 'Назва',
        symbol: 'Позначення',
        created: 'Створено'
      },
      form: {
        title: 'Назва',
        symbol: 'Позначення',
        description: 'Опис',
        shortName: 'Скорочення',
        type: 'Тип вимірювання',
        coefficient: 'Коефіцієнт',
        isActive: 'Активна одиниця вимірювання',
        titlePlaceholder: 'Наприклад: Кілограм',
        shortNamePlaceholder: 'Наприклад: кг',
        coefficientPlaceholder: '1.0',
        descriptionPlaceholder: 'Додаткова інформація про одиницю вимірювання'
      },
      types: {
        weight: 'Вага',
        volume: 'Об\'єм',
        length: 'Довжина',
        area: 'Площа',
        count: 'Кількість',
        time: 'Час'
      },
      edit: {
        title: 'Редагування одиниці вимірювання'
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи'
      }
    },
    rejectionReasons: {
      title: 'Причини відмови',
      single: 'Причина відмови',
      table: {
        title: 'Назва'
      },
      form: {
        title: 'Назва'
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи'
      }
    },
    subscriptions: {
      title: 'Підписки',
      single: 'Підписка'
    }
  },

  // Legacy support - to be removed after full migration
  Главная: 'Головна',
  Клиенты: 'Клієнти',
  Сделки: 'Угоди',
  Места: 'Місця',
  Сотрудники: 'Співробітники',
  Продукты: 'Продукти',
  Настройки: 'Налаштування',

  validation,
  errors,
  common,
  notifications,
}
