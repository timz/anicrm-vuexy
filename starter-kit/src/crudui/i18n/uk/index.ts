import validation from './validation'
import errors from './errors'
import common from './common'
import notifications from './notifications'

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
      single: 'Співробітник'
    },
    products: {
      title: 'Продукти',
      single: 'Продукт'
    },
    places: {
      title: 'Місця',
      single: 'Місце'
    },
    settings: {
      title: 'Налаштування'
    },
    advSources: {
      title: 'Джерела реклами',
      single: 'Джерело реклами'
    },
    clientKids: {
      title: 'Діти клієнтів',
      single: 'Дитина клієнта'
    },
    equipments: {
      title: 'Обладнання',
      single: 'Обладнання'
    },
    eventTypes: {
      title: 'Типи подій',
      single: 'Тип події'
    },
    measures: {
      title: 'Одиниці виміру',
      single: 'Одиниця виміру'
    },
    rejectionReasons: {
      title: 'Причини відмови',
      single: 'Причина відмови'
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
