import { createContext, useContext } from 'react'
import { User } from '../types'
// import { useHistory } from 'react-router-dom'

const defaultAuthState: User = null

export const AuthContext = createContext<User>(defaultAuthState);

/**
 * Custom error class for theme context errors.
 *
 * This error is thrown when the `useTheme` hook is used outside of a `ThemeProvider`.
 *
 * @extends {Error}
 */
class AuthContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthContextError";
  }
}

const useAuth = (): User => {
  const context = useContext(AuthContext);
  if (context !== undefined)
    return context
  else throw new AuthContextError('useAuth must be used within an AuthProvider');
}

// export const useSignIn = () => {
//   const handleSignIn = () => {
//     // const history = useHistory();

//     const signIn = () => {
//       // Example: Store user data in localStorage (adjust based on your app's login logic)
//       localStorage.setItem('user', JSON.stringify({ username: 'user' }));
//       // history.push('/dashboard'); // Redirect to dashboard after signing in
//     };
//   };

//   return handleSignIn;
// };

export const useSignIn = () => {
  
}

export default useAuth