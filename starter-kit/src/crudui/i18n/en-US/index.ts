import validation from './validation'
import errors from './errors'
import common from './common'
import notifications from './notifications'

export default {
  welcome: 'Welcome',
  login: 'Login',
  logout: 'Logout',
  save: 'Save',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  add: 'Add',
  search: 'Search',

  // Authentication
  auth: {
    title: 'Login',
    username: 'Email or Username',
    password: 'Password',
    loginButton: 'Login',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    email: 'Email',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    resetButton: 'Reset Password',
    backToLogin: 'Back to Login'
  },

  // Navigation
  navigation: {
    home: 'Home',
    clients: 'Clients',
    deals: 'Deals',
    places: 'Places',
    employees: 'Employees',
    products: 'Products',
    settings: 'Settings'
  },

  // Modules
  modules: {
    clients: {
      title: 'Clients',
      single: 'Client',
      table: {
        title: 'Title',
        created: 'Created',
        edited: 'Modified',
        mobile: 'Mobile',
        birthday: 'Birthday',
        description: 'Notes',
        advSource: 'Advertising Source'
      },
      form: {
        name: 'Name',
        mobile: 'Mobile',
        birthday: 'Birthday',
        advSource: 'Advertising Source',
        description: 'Notes'
      },
      tabs: {
        clientKids: 'Client Kids'
      },
      validation: {
        nameRequired: 'Name is required',
        nameMinLength: 'Minimum 2 characters'
      }
    },
    deals: {
      title: 'Deals',
      single: 'Deal',
      table: {
        id: 'ID',
        client: 'Client',
        event: 'Event',
        amount: 'Amount',
        margin: 'Margin',
        eventDate: 'Event Date',
        status: 'Status',
        contact: 'Contact',
        created: 'Created'
      },
      filter: {
        id: 'ID',
        contact: 'Contact',
        status: 'Status',
        client: 'Client',
        amount: 'Amount',
        eventType: 'Event Type'
      },
      statuses: {
        new: 'New',
        inProgress: 'In Progress',
        hot: 'Hot',
        cold: 'Cold',
        closed: 'Closed',
        cancelled: 'Cancelled',
        rejected: 'Rejected'
      },
      form: {
        title: 'Deal Title',
        client: 'Client',
        status: 'Status',
        amount: 'Amount',
        currency: 'Currency',
        startDate: 'Start Date',
        closeDate: 'Close Date',
        stage: 'Stage',
        probability: 'Closing Probability (%)',
        source: 'Source',
        responsible: 'Responsible',
        description: 'Description',
        notes: 'Notes'
      },
      currencies: {
        rub: 'Ruble',
        usd: 'US Dollar',
        eur: 'Euro'
      },
      stages: {
        lead: 'Lead',
        contact: 'Contact',
        qualification: 'Qualification',
        proposal: 'Proposal',
        negotiation: 'Negotiation',
        contract: 'Contract',
        closed: 'Closed'
      },
      sources: {
        website: 'Website',
        phone: 'Phone',
        email: 'Email',
        social: 'Social Media',
        referral: 'Referral',
        advertising: 'Advertising',
        partner: 'Partner',
        other: 'Other'
      },
      statusesEdit: {
        new: 'New',
        inProgress: 'In Progress',
        won: 'Won',
        lost: 'Lost',
        onHold: 'On Hold'
      }
    },
    dashboards: {
      title: 'Dashboards'
    },
    workers: {
      title: 'Workers',
      single: 'Worker'
    },
    products: {
      title: 'Products',
      single: 'Product'
    },
    places: {
      title: 'Places',
      single: 'Place'
    },
    settings: {
      title: 'Settings'
    },
    advSources: {
      title: 'Advertising Sources',
      single: 'Advertising Source'
    },
    clientKids: {
      title: 'Client Kids',
      single: 'Client Kid'
    },
    equipments: {
      title: 'Equipment',
      single: 'Equipment'
    },
    eventTypes: {
      title: 'Event Types',
      single: 'Event Type'
    },
    measures: {
      title: 'Units of Measure',
      single: 'Unit of Measure'
    },
    rejectionReasons: {
      title: 'Rejection Reasons',
      single: 'Rejection Reason'
    },
    subscriptions: {
      title: 'Subscriptions',
      single: 'Subscription'
    }
  },

  // Legacy support - to be removed after full migration
  Главная: 'Home',
  Клиенты: 'Clients',
  Сделки: 'Deals',
  Места: 'Places',
  Сотрудники: 'Employees',
  Продукты: 'Products',
  Настройки: 'Settings',

  validation,
  errors,
  common,
  notifications,
}
