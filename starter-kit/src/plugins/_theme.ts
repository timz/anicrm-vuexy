// Material Design цветовая палитра
const COLORS = {
  // Teal палитра
  TEAL_300: '#4DB6AC',
  TEAL_500: '#009688', 
  TEAL_600: '#00897B',
  
  // Green палитра
  GREEN_300: '#81C784',
  GREEN_500: '#4CAF50',
  GREEN_600: '#388E3C',
  
  // Deep Orange палитра
  DEEP_ORANGE_400: '#FF7043',
  DEEP_ORANGE_500: '#FF5722',
  
  // Системные цвета
  RED_500: '#F44336',
  ORANGE_500: '#FF9800', 
  BLUE_500: '#2196F3',
} as const

// Кастомная светлая тема с teal primary цветом
const customLightTheme = {
  dark: false,
  colors: {
    primary: COLORS.TEAL_500,
    'primary-darken-1': COLORS.TEAL_600,
    secondary: COLORS.GREEN_500,
    'secondary-darken-1': COLORS.GREEN_600,
    accent: COLORS.DEEP_ORANGE_500,
    error: COLORS.RED_500,
    warning: COLORS.ORANGE_500,
    info: COLORS.BLUE_500,
    success: COLORS.GREEN_500,
  }
}

// Кастомная темная тема
const customDarkTheme = {
  dark: true,
  colors: {
    primary: COLORS.TEAL_300,
    'primary-darken-1': COLORS.TEAL_500,
    secondary: COLORS.GREEN_300,
    'secondary-darken-1': COLORS.GREEN_500,
    accent: COLORS.DEEP_ORANGE_400,
  }
}

// Экспорт тем для использования в vuetify.ts
export const customTheme = {
  light: customLightTheme,
  dark: customDarkTheme
}