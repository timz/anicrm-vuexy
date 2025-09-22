import validation from './validation'
import errors from './errors'
import common from './common'
import notifications from './notifications'

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
    goBack: 'Back',
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
      pageTitle: 'Clients',
      single: 'Client',
      fields: {
        advSource: 'Advertising Source',
      },
      tabs: {
        clientKids: 'Client Kids',
      },
    },
    deals: {
      title: 'Deals',
      pageTitle: 'Deals',
      single: 'Deal',
      fields: {
        event: 'Event',
        margin: 'Margin',
        eventType: 'Event Type',
        stage: 'Stage',
        probability: 'Closing Probability (%)',
        source: 'Source',
        responsible: 'Responsible',
      },
      statuses: {
        new: 'New',
        inProgress: 'In Progress',
        hot: 'Hot',
        cold: 'Cold',
        closed: 'Closed',
        cancelled: 'Cancelled',
        rejected: 'Rejected',
      },
      currencies: {
        rub: 'Ruble',
        usd: 'US Dollar',
        eur: 'Euro',
      },
      stages: {
        lead: 'Lead',
        contact: 'Contact',
        qualification: 'Qualification',
        proposal: 'Proposal',
        negotiation: 'Negotiation',
        contract: 'Contract',
        closed: 'Closed',
      },
      sources: {
        website: 'Website',
        phone: 'Phone',
        email: 'Email',
        social: 'Social Media',
        referral: 'Referral',
        advertising: 'Advertising',
        partner: 'Partner',
        other: 'Other',
      },
      statusesEdit: {
        new: 'New',
        inProgress: 'In Progress',
        won: 'Won',
        lost: 'Lost',
        onHold: 'On Hold',
      },
    },
    dashboards: {
      title: 'Dashboards',
      pageTitle: 'Dashboards',
    },
    workers: {
      title: 'Workers',
      pageTitle: 'Workers',
      single: 'Worker',
      table: {
        name: 'Name',
        mobile: 'Mobile',
        isOutside: 'External',
        created: 'Created',
      },
      fields: {
        medBook: 'Medical Book',
        sudSprav: 'Criminal Record Certificate',
      },
      filter: {
        all: 'All',
        yes: 'Yes',
        no: 'No',
      },
      actions: {
        invite: 'Invite',
      },
      invite: {
        title: 'Invite Employee',
        email: 'Employee Email',
        success: 'Invitation sent successfully',
        error: 'Error sending invitation',
      },
    },
    products: {
      title: 'Products',
      pageTitle: 'Products',
      single: 'Product',
    },
    places: {
      title: 'Places',
      pageTitle: 'Places',
      single: 'Place',
      table: {
        title: 'Title',
        address: 'Address',
        isAvailable: 'Available',
        workHours: 'Work Hours',
      },
    },
    settings: {
      title: 'Settings',
      pageTitle: 'Settings',
      companyResources: 'Company Resources',
      crm: 'CRM',
    },
    advSources: {
      title: 'Advertising Sources',
      pageTitle: 'Advertising Sources',
      single: 'Advertising Source',
    },
    clientKids: {
      title: 'Client Kids',
      pageTitle: 'Client Kids',
      single: 'Client Kid',
      fields: {
        sex: 'Gender',
      },
      sex: {
        male: 'Boy',
        female: 'Girl',
      },
    },
    equipments: {
      title: 'Equipment',
      pageTitle: 'Equipment',
      single: 'Equipment',
    },
    eventTypes: {
      title: 'Event Types',
      pageTitle: 'Event Types',
      single: 'Event Type',
    },
    measures: {
      title: 'Units of Measure',
      pageTitle: 'Units of Measure',
      single: 'Unit of Measure',
      table: {
        title: 'Title',
      },
      form: {
        title: 'Title',
      },
      validation: {
        titleRequired: 'Title is required',
        titleMinLength: 'Minimum 2 characters',
      },
      fields: {
        shortName: 'Abbreviation',
        type: 'Measurement Type',
        coefficient: 'Coefficient',
        isActive: 'Active Unit of Measure',
        titlePlaceholder: 'e.g., Kilogram',
        shortNamePlaceholder: 'e.g., kg',
        coefficientPlaceholder: '1.0',
        descriptionPlaceholder: 'Additional information about the unit of measure',
      },
      types: {
        weight: 'Weight',
        volume: 'Volume',
        length: 'Length',
        area: 'Area',
        count: 'Count',
        time: 'Time',
      },
      edit: {
        title: 'Edit Unit of Measure',
      },
    },
    rejectionReasons: {
      title: 'Rejection Reasons',
      pageTitle: 'Rejection Reasons',
      single: 'Rejection Reason',
    },
    subscriptions: {
      title: 'Subscriptions',
      pageTitle: 'Subscriptions',
      single: 'Subscription',
    },
  },

  // English keys for navigation (backwards compatibility)
  Home: 'Home',
  Clients: 'Clients',
  Deals: 'Deals',
  Places: 'Places',
  Workers: 'Workers',
  Employees: 'Employees',
  Products: 'Products',
  Settings: 'Settings',

  validation,
  errors,
  common,
  notifications,
}
