'use client'

import { createContext, useContext } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = { theme: Theme; toggleTheme: () => void }

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)
