import validation from './validation'
import errors from './errors'
import common from './common'
import notifications from './notifications'

export default {
  welcome: 'Ласкаво просимо',
  login: 'Вхід',
  logout: 'Вихід',
  save: 'Зберегти',

  // English keys for navigation (backwards compatibility)
  Home: 'Головна',
  Clients: 'Клієнти',
  Deals: 'Угоди',
  Places: 'Місця',
  Workers: 'Співробітники',
  Employees: 'Співробітники',
  Products: 'Продукти',
  Settings: 'Налаштування',

  // User Profile Menu
  userProfile: {
    profile: 'Профіль',
    settings: 'Налаштування',
    pricing: 'Тарифи',
    faq: 'Часті питання',
  },
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
    emailOrUsername: 'Email або ім\'я користувача',
    accountEmail: 'Email облікового запису',
    forgotPassword: 'Забули пароль?',
    resetPassword: 'Скинути пароль',
    email: 'Email',
    newPassword: 'Новий пароль',
    confirmPassword: 'Підтвердіть пароль',
    resetButton: 'Скинути пароль',
    backToLogin: 'Назад до входу',
    welcomeMessage: 'Ласкаво просимо!',
    resetEmailSent: 'На вказаний email надіслано листа з інструкціями по відновленню пароля',
    sendInstructions: 'Надіслати інструкції',
    backToLogin2: '← Повернутися до входу',
    error: 'Помилка',
    goHome: 'На головну',
    goBack: 'Назад',
  },

  // Navigation
  navigation: {
    home: 'Головна',
    clients: 'Клієнти',
    deals: 'Угоди',
    places: 'Місця',
    employees: 'Співробітники',
    products: 'Продукти',
    settings: 'Налаштування',
    sales: 'Продажі',
    company: 'Компанія',
  },

  // Modules
  modules: {
    clients: {
      title: 'Клієнти',
      pageTitle: 'Клієнти',
      single: 'Клієнт',
      fields: {
        name: 'Ім\'я',
        mobile: 'Мобільний',
        birthday: 'День народження',
        advSource: 'Джерело реклами',
        description: 'Опис',
      },
      validation: {
        nameRequired: 'Ім\'я обов\'язкове',
        nameMinLength: 'Мінімум 2 символи',
      },
      tabs: {
        clientKids: 'Діти клієнта',
      },
    },
    deals: {
      title: 'Угоди',
      pageTitle: 'Угоди',
      single: 'Угода',
      fields: {
        title: 'Назва',
        client: 'Клієнт',
        status: 'Статус',
        amount: 'Сума',
        currency: 'Валюта',
        startDate: 'Дата початку',
        closeDate: 'Дата закриття',
        event: 'Захід',
        margin: 'Маржа',
        eventType: 'Тип заходу',
        stage: 'Етап',
        probability: 'Вірогідність закриття (%)',
        source: 'Джерело',
        responsible: 'Відповідальний',
        description: 'Опис',
        notes: 'Примітки',
      },
      statuses: {
        new: 'Нова',
        inProgress: 'У роботі',
        hot: 'Гаряча',
        cold: 'Холодна',
        closed: 'Закрита',
        cancelled: 'Скасована',
        rejected: 'Відхилена',
      },
      currencies: {
        rub: 'Рубль',
        usd: 'Долар США',
        eur: 'Євро',
      },
      stages: {
        lead: 'Лід',
        contact: 'Контакт',
        qualification: 'Кваліфікація',
        proposal: 'Пропозиція',
        negotiation: 'Переговори',
        contract: 'Контракт',
        closed: 'Закрита',
      },
      sources: {
        website: 'Веб-сайт',
        phone: 'Телефон',
        email: 'Email',
        social: 'Соціальні мережі',
        referral: 'Рекомендація',
        advertising: 'Реклама',
        partner: 'Партнер',
        other: 'Інше',
      },
      statusesEdit: {
        new: 'Нова',
        inProgress: 'У роботі',
        won: 'Виграна',
        lost: 'Програна',
        onHold: 'На утриманні',
      },
    },
    dashboards: {
      title: 'Панелі управління',
      pageTitle: 'Панелі управління',
    },
    workers: {
      title: 'Співробітники',
      pageTitle: 'Співробітники',
      single: 'Співробітник',
      table: {
        name: 'Ім\'я',
        mobile: 'Мобільний',
        isOutside: 'Зовнішній',
        created: 'Створено',
      },
      fields: {
        name: 'Ім\'я',
        mobile: 'Мобільний',
        birthday: 'День народження',
        medBook: 'Медична книжка',
        sudSprav: 'Довідка про судимість',
        description: 'Опис',
      },
      filter: {
        all: 'Всі',
        yes: 'Так',
        no: 'Ні',
      },
      actions: {
        invite: 'Запросити',
      },
      invite: {
        title: 'Запрошення співробітника',
        email: 'Email співробітника',
        success: 'Запрошення успішно надіслано',
        error: 'Помилка при надсиланні запрошення',
      },
    },
    products: {
      title: 'Продукти',
      pageTitle: 'Продукти',
      single: 'Продукт',
    },
    places: {
      title: 'Місця',
      pageTitle: 'Місця',
      single: 'Місце',
      table: {
        title: 'Назва',
        address: 'Адреса',
        isAvailable: 'Доступно',
        workHours: 'Години роботи',
      },
      fields: {
        isAvailable: 'Доступно',
        description: 'Опис',
      },
    },
    settings: {
      title: 'Налаштування',
      pageTitle: 'Налаштування',
      companyResources: 'Ресурси компанії',
      crm: 'CRM',
    },
    advSources: {
      title: 'Джерела реклами',
      pageTitle: 'Джерела реклами',
      single: 'Джерело реклами',
    },
    clientKids: {
      title: 'Діти клієнтів',
      pageTitle: 'Діти клієнтів',
      single: 'Дитина клієнта',
      fields: {
        sex: 'Стать',
      },
    },
    equipments: {
      title: 'Обладнання',
      pageTitle: 'Обладнання',
      single: 'Обладнання',
    },
    eventTypes: {
      title: 'Типи подій',
      pageTitle: 'Типи подій',
      single: 'Тип події',
    },
    measures: {
      title: 'Одиниці виміру',
      pageTitle: 'Одиниці виміру',
      single: 'Одиниця виміру',
      table: {
        title: 'Назва',
      },
      form: {
        title: 'Назва',
      },
      validation: {
        titleRequired: 'Назва обов\'язкова',
        titleMinLength: 'Мінімум 2 символи',
      },
      fields: {
        shortName: 'Скорочення',
        type: 'Тип вимірювання',
        coefficient: 'Коефіцієнт',
        isActive: 'Активна одиниця вимірювання',
        titlePlaceholder: 'Наприклад: Кілограм',
        shortNamePlaceholder: 'Наприклад: кг',
        coefficientPlaceholder: '1.0',
        descriptionPlaceholder: 'Додаткова інформація про одиницю вимірювання',
      },
      types: {
        weight: 'Вага',
        volume: 'Об\'єм',
        length: 'Довжина',
        area: 'Площа',
        count: 'Кількість',
        time: 'Час',
      },
      edit: {
        title: 'Редагування одиниці вимірювання',
      },
    },
    rejectionReasons: {
      title: 'Причини відмови',
      pageTitle: 'Причини відмови',
      single: 'Причина відмови',
    },
    subscriptions: {
      title: 'Підписки',
      pageTitle: 'Підписки',
      single: 'Підписка',
    },
  },

  validation,
  errors,
  common,
  notifications,
}
