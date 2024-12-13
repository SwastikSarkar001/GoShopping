import React, { useState, useEffect } from 'react'
import { themeValues } from '../types'
import { ThemeContext } from '../hooks/useTheme'

type providerType = {
  children: React.ReactNode
}

/**
 * A provider component for managing and providing the theme context.
 *
 * This component initializes the theme based on the user's preference or system settings,
 * and provides the theme context to its children. It also persists the theme choice in
 * `localStorage` to retain the selected theme across page reloads.
 *
 * @param {providerType} props - The props for the provider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the theme context.
 * 
 * @returns The provider component that wraps its children with the theme context.
 */
export default function ThemeProvider({ children }: providerType) {
  const [theme, setTheme] = useState<themeValues>(localStorage.getItem('theme') as themeValues)

  useEffect(() => {
    switch (theme) {
      case 'dark':
        if (theme !== null) document.body.classList.add(theme)
        break
      case '':
        break
      default:
        if (window.matchMedia("prefers-color-scheme: dark")) {
          document.body.classList.add('dark')
          localStorage.setItem('theme', 'dark')
          setTheme('dark')
        }
        else {
          localStorage.setItem('theme', '')
          setTheme('')
        }
    }
  }, [theme])
  const toggleTheme = () => {
    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', '')
      setTheme('')
    }
    else {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}