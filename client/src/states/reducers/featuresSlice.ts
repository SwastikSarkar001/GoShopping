import { createSlice } from "@reduxjs/toolkit"

/**
 * Represents the details of a feature in the website.
 */
export type FeatureDetail = {
  /**
   * Unique identifier for the feature.
   * @example "feature023"
   */
  featureID: string;

  /**
   * The name of the feature.
   * @example "Premium Support"
   */
  title: string;

  /**
   * A brief description of what the feature offers.
   * @example "Provides 24/7 premium customer support."
   */
  description: string;

  /**
   * A React component that renders the feature's section.
   * @returns A JSX element representing the feature's section.
   */
  sectionComponent: () => JSX.Element;

  /**
   * Monthly price for the feature used by 1 user, in INR.
   * @example 9.99
   */
  price_per_user_per_month: number;

  /**
   * The tier for the feature.
   * The tiers are as follows:
   * 1. Basic - upto 5 users
   * 2. Standard - upto 10 users
   * 3. Premium - upto 15 users
   * 4. Advanced - upto 20 users
   * 5. Enterprise - upto 25 users
   * 6. Ultimate - upto 30 users
   * 7. Supreme - upto 40 users
   * 8. Elite - upto 50 users
   * @example 100
   * @default 0 (Not selected)
   */
  tier: number;
}

/** The default features state of the application. */
export const defaultFeatures: FeatureDetail[] = []

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