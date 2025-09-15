import type { LiteralUnion } from 'type-fest'

export const resolveVuetifyTheme = (defaultTheme: LiteralUnion<'light' | 'dark' | 'system', string>): 'light' | 'dark' => {
  const preferredDark = usePreferredDark().value
  const storedTheme = defaultTheme

  return storedTheme === 'system'
    ? (preferredDark ? 'dark' : 'light')
    : storedTheme as 'light' | 'dark'
}
