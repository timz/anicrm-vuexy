import errors from './errors'
import common from './common'
import notifications from './notifications'
import validation from './validation'

export default {
  welcome: 'Добро пожаловать',
  login: 'Вход',
  logout: 'Выход',
  save: 'Сохранить',

  // User Profile Menu
  userProfile: {
    profile: 'Профиль',
    settings: 'Настройки',
    pricing: 'Тарифы',
    faq: 'Часто задаваемые вопросы',
  },
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
    emailOrUsername: 'Email или имя пользователя',
    accountEmail: 'Email учетной записи',
    forgotPassword: 'Забыли пароль?',
    resetPassword: 'Сброс пароля',
    email: 'Email',
    newPassword: 'Новый пароль',
    confirmPassword: 'Подтвердите пароль',
    resetButton: 'Сбросить пароль',
    backToLogin: 'Назад к входу',
    welcomeMessage: 'Добро пожаловать!',
    resetEmailSent: 'На указанный email выслано письмо с инструкциями по восстановлению пароля',
    sendInstructions: 'Отправить инструкции',
    backToLogin2: '← Вернуться к входу',
    error: 'Ошибка',
    goHome: 'На главную',
    goBack: 'Назад',
  },

  // Navigation
  navigation: {
    home: 'Главная',
    clients: 'Клиенты',
    deals: 'Сделки',
    places: 'Места',
    employees: 'Сотрудники',
    products: 'Продукты',
    settings: 'Настройки',
    sales: 'Продажи',
    company: 'Компания',
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
        advSource: 'Источник рекламы',
      },
      form: {
        name: 'Название',
        mobile: 'Мобильный',
        birthday: 'Дата рождения',
        advSource: 'Источник рекламы',
        description: 'Заметки',
      },
      tabs: {
        clientKids: 'Дети клиента',
      },
      validation: {
        nameRequired: 'Название обязательно',
        nameMinLength: 'Минимум 2 символа',
      },
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
        created: 'Создан',
      },
      filter: {
        id: 'ID',
        contact: 'Контакт',
        status: 'Статус',
        client: 'Клиент',
        amount: 'Сумма',
        eventType: 'Тип мероприятия',
      },
      statuses: {
        new: 'Новая',
        inProgress: 'В работе',
        hot: 'Горячая',
        cold: 'Холодная',
        closed: 'Закрыта',
        cancelled: 'Отменена',
        rejected: 'Отклонена',
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
        notes: 'Заметки',
      },
      currencies: {
        rub: 'Рубль',
        usd: 'Доллар США',
        eur: 'Евро',
      },
      stages: {
        lead: 'Лид',
        contact: 'Контакт',
        qualification: 'Квалификация',
        proposal: 'Предложение',
        negotiation: 'Переговоры',
        contract: 'Договор',
        closed: 'Закрыта',
      },
      sources: {
        website: 'Веб-сайт',
        phone: 'Телефон',
        email: 'Email',
        social: 'Социальные сети',
        referral: 'Рекомендация',
        advertising: 'Реклама',
        partner: 'Партнер',
        other: 'Другое',
      },
      statusesEdit: {
        new: 'Новая',
        inProgress: 'В работе',
        won: 'Выиграна',
        lost: 'Проиграна',
        onHold: 'На удержании',
      },
    },
    dashboards: {
      title: 'Панели управления',
    },
    workers: {
      title: 'Сотрудники',
      single: 'Сотрудник',
      table: {
        name: 'ФИО',
        mobile: 'Телефон',
        isOutside: 'Внешний',
        created: 'Создан',
      },
      form: {
        name: 'Имя',
        mobile: 'Мобильный телефон',
        email: 'Email',
        position: 'Должность',
        isOutside: 'Внешний сотрудник',
        description: 'Описание',
        birthday: 'Дата рождения',
        medBook: 'Медицинская книжка',
        sudSprav: 'Судебная справка',
      },
      filter: {
        all: 'Все',
        yes: 'Да',
        no: 'Нет',
      },
      actions: {
        invite: 'Пригласить',
      },
      invite: {
        title: 'Приглашение сотрудника',
        email: 'Email сотрудника',
        success: 'Приглашение успешно отправлено',
        error: 'Ошибка при отправке приглашения',
      },
    },
    products: {
      title: 'Продукты',
      single: 'Продукт',
      table: {
        title: 'Название',
        price: 'Цена',
        category: 'Категория',
        created: 'Создан',
        measure: 'Единица измерения',
      },
      form: {
        title: 'Название',
        price: 'Цена',
        category: 'Категория',
        description: 'Описание',
      },
      filter: {
        id: 'Ид',
        title: 'Название',
        measure: 'Мера',
      },
    },
    places: {
      title: 'Места',
      single: 'Место',
      table: {
        title: 'Название',
        address: 'Адрес',
        capacity: 'Вместимость',
        created: 'Создан',
        isAvailable: 'Доступно',
        workHours: 'Часы работы',
      },
      form: {
        title: 'Название',
        address: 'Адрес',
        capacity: 'Вместимость',
        description: 'Описание',
        isAvailable: 'Доступно',
        workFrom: 'Работает с (час)',
        workTo: 'Работает до (час)',
      },
      validation: {
        titleRequired: 'Название обязательно',
        titleMinLength: 'Минимум 2 символа',
        hourRange: 'Час от 0 до 23',
      },
    },
    settings: {
      title: 'Настройки',
      companyResources: 'Ресурсы компании',
      crm: 'CRM',
    },
    advSources: {
      title: 'Источники рекламы',
      single: 'Источник рекламы',
      table: {
        title: 'Название',
      },
      form: {
        title: 'Название',
      },
      validation: {
        titleRequired: 'Название обязательно',
        titleMinLength: 'Минимум 2 символа',
      },
    },
    clientKids: {
      title: 'Дети клиентов',
      single: 'Ребенок клиента',
      table: {
        name: 'Имя',
        birthday: 'День рождения',
      },
      form: {
        name: 'Имя',
        sex: 'Пол',
        birthday: 'Дата рождения',
      },
      sex: {
        male: 'Мальчик',
        female: 'Девочка',
      },
    },
    equipments: {
      title: 'Оборудование',
      single: 'Оборудование',
      table: {
        title: 'Название',
        stateId: 'Статус',
        description: 'Описание',
        created: 'Создано',
        edited: 'Изменено',
      },
      form: {
        title: 'Название',
        stateId: 'Статус',
        description: 'Описание',
      },
      validation: {
        titleRequired: 'Название обязательно',
        titleMinLength: 'Минимум 2 символа',
      },
    },
    eventTypes: {
      title: 'Типы событий',
      single: 'Тип события',
      table: {
        title: 'Название',
      },
      form: {
        title: 'Название',
      },
      validation: {
        titleRequired: 'Название обязательно',
        titleMinLength: 'Минимум 2 символа',
      },
    },
    measures: {
      title: 'Единицы измерения',
      single: 'Единица измерения',
      table: {
        title: 'Название',
        symbol: 'Обозначение',
        created: 'Создан',
      },
      form: {
        title: 'Название',
        symbol: 'Обозначение',
        description: 'Описание',
        shortName: 'Сокращение',
        type: 'Тип измерения',
        coefficient: 'Коэффициент',
        isActive: 'Активная единица измерения',
        titlePlaceholder: 'Например: Килограмм',
        shortNamePlaceholder: 'Например: кг',
        coefficientPlaceholder: '1.0',
        descriptionPlaceholder: 'Дополнительная информация об единице измерения',
      },
      types: {
        weight: 'Вес',
        volume: 'Объем',
        length: 'Длина',
        area: 'Площадь',
        count: 'Количество',
        time: 'Время',
      },
      edit: {
        title: 'Редактирование единицы измерения',
      },
      validation: {
        titleRequired: 'Название обязательно',
        titleMinLength: 'Минимум 2 символа',
      },
    },
    rejectionReasons: {
      title: 'Причины отказа',
      single: 'Причина отказа',
      table: {
        title: 'Название',
      },
      form: {
        title: 'Название',
      },
      validation: {
        titleRequired: 'Название обязательно',
        titleMinLength: 'Минимум 2 символа',
      },
    },
    subscriptions: {
      title: 'Подписки',
      single: 'Подписка',
    },
  },

  validation,
  errors,
  common,
  notifications,
}
