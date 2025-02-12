import { createSlice } from "@reduxjs/toolkit"

/** The current theme state object of the application. Contains only theme value. */
interface Theme {
  /** Provides the current theme value, either `''` (light mode) or `'dark'` (dark mode). */
  theme: '' | 'dark'
}

/** The default theme state of the application. */
export const defaultTheme: Theme = {
  theme: localStorage.getItem('theme') !== null ? localStorage.getItem('theme') as ('' | 'dark') : window.matchMedia("prefers-color-scheme: dark").matches ? 'dark' : ''
}

/**
 * A slice for managing the theme state of the application.
 * 
 * This slice contains only one reducer:
 * 
 * `toggleTheme`: Toggles the theme between 'dark' and default. It updates the 
 * `document.body` class and persists the theme preference in `localStorage`.
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState: defaultTheme,
  reducers: {
    /**
     * Toggles the theme between `'dark'` (dark mode) and `''` (light mode).
     * @param state The state object of the theme slice.
     */
    toggleTheme: (state) => {
      if (state.theme === 'dark') {
        document.body.classList.remove('dark')
        localStorage.setItem('theme', '')
        state.theme = ''
      }
      else {
        document.body.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        state.theme = 'dark'
      }
    }
  }
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer