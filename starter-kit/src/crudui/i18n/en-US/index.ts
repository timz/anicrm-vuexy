import validation from './validation.ts'
import errors from './errors.ts'
import common from './common.ts'
import notifications from './notifications.ts'

export default {
  welcome: 'Welcome',
  login: 'Login',
  logout: 'Logout',
  save: 'Save',

  // User Profile Menu
  userProfile: {
    profile: 'Profile',
    settings: 'Settings',
    pricing: 'Pricing',
    faq: 'FAQ',
  },
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  add: 'Add',
  search: 'Search',

  // Common translations
  common: {
    all: 'All',
    yes: 'Yes',
    no: 'No'
  },

  // Authentication
  auth: {
    title: 'Login',
    username: 'Email or Username',
    password: 'Password',
    loginButton: 'Login',
    emailOrUsername: 'Email or Username',
    accountEmail: 'Account Email',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    email: 'Email',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    resetButton: 'Reset Password',
    backToLogin: 'Back to Login',
    welcomeMessage: 'Welcome!',
    resetEmailSent: 'Instructions have been sent to the specified email address',
    sendInstructions: 'Send Instructions',
    backToLogin2: '← Back to Login',
    error: 'Error',
    goHome: 'Go Home',
    goBack: 'Back'
  },

  // Navigation
  navigation: {
    home: 'Home',
    clients: 'Clients',
    deals: 'Deals',
    places: 'Places',
    employees: 'Employees',
    products: 'Products',
    settings: 'Settings',
    sales: 'Sales',
    company: 'Company',
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
      single: 'Worker',
      table: {
        name: 'Name',
        mobile: 'Phone',
        isOutside: 'External',
        created: 'Created'
      },
      form: {
        name: 'Name',
        mobile: 'Mobile Phone',
        email: 'Email',
        birthday: 'Date of Birth',
        medBook: 'Medical Book',
        sudSprav: 'Criminal Record Certificate',
        description: 'Description',
        position: 'Position',
        isOutside: 'External Employee'
      },
      filter: {
        all: 'All',
        yes: 'Yes',
        no: 'No'
      },
      actions: {
        invite: 'Invite'
      },
      invite: {
        title: 'Invite Employee',
        email: 'Employee Email',
        success: 'Invitation sent successfully',
        error: 'Error sending invitation'
      }
    },
    products: {
      title: 'Products',
      single: 'Product',
      table: {
        title: 'Title',
        price: 'Price',
        category: 'Category',
        created: 'Created',
        measure: 'Unit of Measure'
      },
      form: {
        title: 'Title',
        price: 'Price',
        category: 'Category',
        description: 'Description',
        measure: 'Unit of Measure'
      },
      filter: {
        id: 'ID',
        title: 'Title',
        measure: 'Measure'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters'
      }
    },
    places: {
      title: 'Places',
      single: 'Place',
      table: {
        title: 'Title',
        address: 'Address',
        capacity: 'Capacity',
        created: 'Created',
        isAvailable: 'Available',
        workHours: 'Working Hours'
      },
      form: {
        title: 'Title',
        address: 'Address',
        capacity: 'Capacity',
        description: 'Description',
        isAvailable: 'Available',
        workFrom: 'Working From (hour)',
        workTo: 'Working To (hour)'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters',
        hourRange: 'Hour from 0 to 23'
      }
    },
    settings: {
      title: 'Settings'
    },
    advSources: {
      title: 'Advertising Sources',
      single: 'Advertising Source',
      table: {
        title: 'Title'
      },
      form: {
        title: 'Title'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters'
      }
    },
    clientKids: {
      title: 'Client Kids',
      single: 'Client Kid',
      table: {
        name: 'Name',
        birthday: 'Birthday'
      },
      form: {
        name: 'Name',
        sex: 'Gender',
        birthday: 'Date of Birth'
      },
      sex: {
        male: 'Boy',
        female: 'Girl'
      }
    },
    equipments: {
      title: 'Equipment',
      single: 'Equipment',
      table: {
        title: 'Title',
        stateId: 'Status',
        description: 'Description',
        created: 'Created',
        edited: 'Modified'
      },
      form: {
        title: 'Title',
        stateId: 'Status',
        description: 'Description'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters'
      }
    },
    eventTypes: {
      title: 'Event Types',
      single: 'Event Type',
      table: {
        title: 'Title'
      },
      form: {
        title: 'Title'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters'
      }
    },
    measures: {
      title: 'Units of Measure',
      single: 'Unit of Measure',
      table: {
        title: 'Title',
        symbol: 'Symbol',
        created: 'Created'
      },
      form: {
        title: 'Title',
        symbol: 'Symbol',
        shortName: 'Abbreviation',
        type: 'Measurement Type',
        coefficient: 'Coefficient',
        description: 'Description',
        isActive: 'Active Unit of Measure',
        titlePlaceholder: 'e.g., Kilogram',
        shortNamePlaceholder: 'e.g., kg',
        coefficientPlaceholder: '1.0',
        descriptionPlaceholder: 'Additional information about the unit of measure'
      },
      types: {
        weight: 'Weight',
        volume: 'Volume',
        length: 'Length',
        area: 'Area',
        count: 'Count',
        time: 'Time'
      },
      edit: {
        title: 'Edit Unit of Measure'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters'
      }
    },
    rejectionReasons: {
      title: 'Rejection Reasons',
      single: 'Rejection Reason',
      table: {
        title: 'Title'
      },
      form: {
        title: 'Title'
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters'
      }
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

  // Temporary keys for backwards compatibility
  Home: 'Home',
  Clients: 'Clients',
  Deals: 'Deals',
  Places: 'Places',
  Workers: 'Workers',
  Employees: 'Employees',
  Products: 'Products',
  Settings: 'Settings',
}
