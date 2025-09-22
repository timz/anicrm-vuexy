import validation from './validation'
import errors from './errors'
import common from './common'
import notifications from './notifications'

export default {
  welcome: 'Добро пожаловать',
  login: 'Вход',
  logout: 'Выход',
  save: 'Сохранить',
  cancel: 'Отмена',
  edit: 'Редактировать',
  delete: 'Удалить',
  add: 'Добавить',
  search: 'Поиск',

  // Authentication
  auth: {
    title: 'Вход',
    username: 'Email или имя пользователя',
    password: 'Пароль',
    loginButton: 'Войти',
    forgotPassword: 'Забыли пароль?',
    resetPassword: 'Сброс пароля',
    email: 'Email',
    newPassword: 'Новый пароль',
    confirmPassword: 'Подтвердите пароль',
    resetButton: 'Сбросить пароль',
    backToLogin: 'Назад к входу'
  },

  // Navigation
  navigation: {
    home: 'Главная',
    clients: 'Клиенты',
    deals: 'Сделки',
    places: 'Места',
    employees: 'Сотрудники',
    products: 'Продукты',
    settings: 'Настройки'
  },

  // Modules
  modules: {
    clients: {
      title: 'Клиенты',
      single: 'Клиент',
      table: {
        title: 'Название',
        created: 'Создан',
        edited: 'Правки',
        mobile: 'Мобильный',
        birthday: 'Дата рождения',
        description: 'Заметки',
        advSource: 'Источник рекламы'
      },
      form: {
        name: 'Название',
        mobile: 'Мобильный',
        birthday: 'Дата рождения',
        advSource: 'Источник рекламы',
        description: 'Заметки'
      },
      tabs: {
        clientKids: 'Дети клиента'
      },
      validation: {
        nameRequired: 'Название обязательно',
        nameMinLength: 'Минимум 2 символа'
      }
    },
    deals: {
      title: 'Сделки',
      single: 'Сделка',
      table: {
        id: 'ID',
        client: 'Клиент',
        event: 'Мероприятие',
        amount: 'Сумма',
        margin: 'Маржа',
        eventDate: 'Дата мероприятия',
        status: 'Статус',
        contact: 'Контакт',
        created: 'Создан'
      },
      filter: {
        id: 'ID',
        contact: 'Контакт',
        status: 'Статус',
        client: 'Клиент',
        amount: 'Сумма',
        eventType: 'Тип мероприятия'
      },
      statuses: {
        new: 'Новая',
        inProgress: 'В работе',
        hot: 'Горячая',
        cold: 'Холодная',
        closed: 'Закрыта',
        cancelled: 'Отменена',
        rejected: 'Отклонена'
      },
      form: {
        title: 'Название сделки',
        client: 'Клиент',
        status: 'Статус',
        amount: 'Сумма',
        currency: 'Валюта',
        startDate: 'Дата начала',
        closeDate: 'Дата закрытия',
        stage: 'Этап',
        probability: 'Вероятность закрытия (%)',
        source: 'Источник',
        responsible: 'Ответственный',
        description: 'Описание',
        notes: 'Заметки'
      },
      currencies: {
        rub: 'Рубль',
        usd: 'Доллар США',
        eur: 'Евро'
      },
      stages: {
        lead: 'Лид',
        contact: 'Контакт',
        qualification: 'Квалификация',
        proposal: 'Предложение',
        negotiation: 'Переговоры',
        contract: 'Договор',
        closed: 'Закрыта'
      },
      sources: {
        website: 'Веб-сайт',
        phone: 'Телефон',
        email: 'Email',
        social: 'Социальные сети',
        referral: 'Рекомендация',
        advertising: 'Реклама',
        partner: 'Партнер',
        other: 'Другое'
      },
      statusesEdit: {
        new: 'Новая',
        inProgress: 'В работе',
        won: 'Выиграна',
        lost: 'Проиграна',
        onHold: 'На удержании'
      }
    },
    dashboards: {
      title: 'Панели управления'
    },
    workers: {
      title: 'Сотрудники',
      single: 'Сотрудник',
      table: {
        name: 'ФИО',
        mobile: 'Телефон',
        isOutside: 'Внешний',
        created: 'Создан'
      },
      form: {
        name: 'ФИО',
        mobile: 'Телефон',
        email: 'Email',
        position: 'Должность',
        isOutside: 'Внешний сотрудник',
        description: 'Описание'
      },
      filter: {
        all: 'Все',
        yes: 'Да',
        no: 'Нет'
      }
    },
    products: {
      title: 'Продукты',
      single: 'Продукт',
      table: {
        title: 'Название',
        price: 'Цена',
        category: 'Категория',
        created: 'Создан'
      },
      form: {
        title: 'Название',
        price: 'Цена',
        category: 'Категория',
        description: 'Описание'
      }
    },
    places: {
      title: 'Места',
      single: 'Место',
      table: {
        title: 'Название',
        address: 'Адрес',
        capacity: 'Вместимость',
        created: 'Создан'
      },
      form: {
        title: 'Название',
        address: 'Адрес',
        capacity: 'Вместимость',
        description: 'Описание'
      }
    },
    settings: {
      title: 'Настройки'
    },
    advSources: {
      title: 'Источники рекламы',
      single: 'Источник рекламы'
    },
    clientKids: {
      title: 'Дети клиентов',
      single: 'Ребенок клиента'
    },
    equipments: {
      title: 'Оборудование',
      single: 'Оборудование'
    },
    eventTypes: {
      title: 'Типы событий',
      single: 'Тип события'
    },
    measures: {
      title: 'Единицы измерения',
      single: 'Единица измерения',
      table: {
        title: 'Название',
        symbol: 'Обозначение',
        created: 'Создан'
      },
      form: {
        title: 'Название',
        symbol: 'Обозначение',
        description: 'Описание'
      }
    },
    rejectionReasons: {
      title: 'Причины отказа',
      single: 'Причина отказа'
    },
    subscriptions: {
      title: 'Подписки',
      single: 'Подписка'
    }
  },

  // Legacy support - to be removed after full migration
  Главная: 'Главная',
  Клиенты: 'Клиенты',
  Сделки: 'Сделки',
  Места: 'Места',
  Сотрудники: 'Сотрудники',
  Продукты: 'Продукты',
  Настройки: 'Настройки',

  validation,
  errors,
  common,
  notifications,
}
