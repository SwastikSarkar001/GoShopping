import { useState, useEffect } from 'react';
import { NavbarHeightContext } from '../hooks/useNavbarHeight';

type providerType = {
  children: React.ReactNode
}

/**
 * NavHeightProvider is a context provider component that calculates and provides
 * the height of the navbar to its children components. It uses the ResizeObserver
 * API to monitor changes in the navbar's height and updates the context value accordingly.
 * 
 * @param {providerType} props - The props for the NavHeightProvider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the navbar height context.
 * 
 * @returns The provider component that wraps its children with the NavbarHeightContext.
 */
export default function NavHeightProvider({ children }: providerType) {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const navbarElement = document.getElementById('navbar'); // assuming the navbar has an id of 'navbar'

    if (navbarElement) {
      const updateHeight = () => {
        setHeight(navbarElement.offsetHeight);
      };

      // Observe the size changes of the navbar using ResizeObserver
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(navbarElement);

      // Initial height
      updateHeight();

      // Clean up the observer when the component unmounts
      return () => resizeObserver.disconnect();
    }
  }, [height]);

  return (
    <NavbarHeightContext.Provider value={{ height }}>
      {children}
    </NavbarHeightContext.Provider>
  )
}