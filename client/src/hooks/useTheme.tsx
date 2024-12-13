import { createContext, useContext } from 'react'
import { themeValues } from '../types'

type ThemeContextType = {
  /** Provides the current theme value, either `''` (light mode) or `'dark'` (dark mode). */
  theme: themeValues,
  /** Function to toggle between themes. */
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom error class for theme context errors.
 *
 * This error is thrown when the `useTheme` hook is used outside of a `ThemeProvider`.
 *
 * @extends {Error}
 */
class ThemeContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThemeContextError";
  }
}

/**
 * A custom hook for accessing the theme context.
 *
 * This  hook provides the current theme and a function to toggle the theme.
 * It throws an error if used outside of a `ThemeProvider`.
 *
 * @throws Will throw `ThemeContextError` if used outside of a `ThemeProvider`.
 * 
 * @returns {ThemeContextType} An object containing:
 * - `theme`: The current theme of the app, either `''` (light mode) or `'dark'` (dark mode).
 * - `toggleTheme`: A function to toggle the theme between light and dark modes.
 * 
 * @example
 * // Usage in a component
 * function MyThemeComponent() {
 *   const { theme, toggleTheme } = useTheme();
 * 
 *   return (
 *     <div className={`app ${theme}`}>
 *       <h1>Welcome to the {theme === '' ? 'light' : 'dark'} theme!</h1>
 *       <button onClick={toggleTheme}>
 *         Switch to {theme === '' ? 'Dark' : 'Light'} Mode
 *       </button>
 *     </div>
 *   );
 * }
 */
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context !== undefined)
    return context
  else throw new ThemeContextError('useTheme must be used within a ThemeProvider');
}

export default useTheme