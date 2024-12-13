import { useContext, createContext } from "react"

type NavbarHeightContextType = {
  height: number;
}

/**
 * Context to provide the height of the navbar.
 * This context should be used to share the navbar height across the component tree.
 */
export const NavbarHeightContext = createContext<NavbarHeightContextType | undefined>(undefined);

/**
 * Custom hook to use the NavbarHeightContext.
 * This hook provides the height of the navbar.
 * 
 * @throws Will throw an error if used outside of a NavHeightProvider.
 * @returns {NavbarHeightContextType} The context value containing the navbar height.
 */
const useNavbarHeight = () => {
  const context = useContext(NavbarHeightContext);
  if (!context) {
    throw new Error('useNavbarHeight must be used within a NavHeightProvider');
  }
  return context;
}

export default useNavbarHeight