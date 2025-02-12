// import React, { useState, useEffect, PropsWithChildren } from 'react'
// import axios from 'axios'
// import { AuthContext } from '../hooks/Auth'
// import { emptyProps, User } from '../types'
// import { toast } from 'sonner'
// import { UserCredentialsType } from '../components/Authentication/SignUpForm'

// type AuthProviderProps = emptyProps
// type AuthProviderFinalProps = React.PropsWithChildren<AuthProviderProps>

// export default function AuthProvider({ children }: AuthProviderFinalProps) {
//   // State to hold the current user and the access token
//   const [user, setUser] = useState<User>(null)
//   // Optional: track loading state while checking login status on app load.
//   const [loading, setLoading] = useState(true);

//   /**
//    * Sign in the user using their credentials.
//    * @param {string} email 
//    * @param {string} password 
//    */
//   const signIn = async (email, password) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // credentials included if your backend needs to set HttpOnly cookies (for refresh token)
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setUser(data.user);
//         // The refresh token is assumed to be set in an HttpOnly cookie by the backend.
//       } else {
//         throw new Error(data.message || 'Sign in failed');
//       }
//     } catch (error) {
//       console.error('Sign in error:', error);
//       throw error;
//     }
//   };

//   /**
//    * Sign up a new user. Depending on your flow, you may sign in automatically after signup.
//    * @param {UserCredentialsType} data The user data of Registration Form
//    */
//   const register = async (data: UserCredentialsType): Promise<void> => {
//     const finalData = {
//       firstname: data.fname,
//       middlename: data.mname,
//       lastname: data.lname,
//       email: data.email,
//       phone: data.phone,
//       city: data.city,
//       state: data.state,
//       country: data.country,
//       password: data.password
//     }
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
//         finalData,
//         {
//           validateStatus: (status) => status === 200 || status === 409
//         }
//       )
//       if (response.status === 200) {
//         toast.success('Registration successful! You are now a part of eazzyBizz family.')
//         // Further rerouting logic can be added here
//       }
//       else {
//         toast.error(`Registration failed! ${response.data.data.message}`)
//       }
//     }
//     catch (err) {
//       toast.error('An error occurred while registering. Please try again later.')
//       console.error(err)
//     }
//   };

//   /**
//    * Sign out the user by calling the backend to clear any session data and then resetting client state.
//    */
//   const signOut = async () => {
//     try {
//       await fetch('/api/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//     }
//   };

  
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/me`)
//         if (response.data.success) {
//           setUser(response.data.data[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching current user', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user: user,
//         loading: loading,
//         signIn: signIn,
//         signUp: register,
//         signOut: signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };




// // Provider component that wraps your app and makes auth object available via Context.
// const AuthProvider2: React.FC<AuthProviderProps> = ({ children }) => {
//   // State to hold the current user and the access token
//   const [user, setUser] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
//   // Optional: track loading state while checking login status on app load.
//   const [loading, setLoading] = useState(true);

//   /**
//    * Refresh the access token using the refresh token (stored as an HttpOnly cookie, for example)
//    */
//   const refreshAccessToken = async () => {
//     try {
//       // Call your backend endpoint for refreshing tokens.
//       const response = await fetch('/api/refresh', {
//         method: 'POST',
//         credentials: 'include', // send cookies if the refresh token is stored in cookies
//       });
//       const data = await response.json();

//       if (response.ok && data.accessToken) {
//         setAccessToken(data.accessToken);
//       } else {
//         // If the refresh token is invalid, sign the user out.
//         await signOut();
//       }
//     } catch (error) {
//       console.error('Error refreshing token', error);
//       await signOut();
//     }
//   };

//   /**
//    * Sign in the user using their credentials.
//    * @param {string} email 
//    * @param {string} password 
//    */
//   const signIn = async (email, password) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // credentials included if your backend needs to set HttpOnly cookies (for refresh token)
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setUser(data.user);
//         setAccessToken(data.accessToken);
//         // The refresh token is assumed to be set in an HttpOnly cookie by the backend.
//       } else {
//         throw new Error(data.message || 'Sign in failed');
//       }
//     } catch (error) {
//       console.error('Sign in error:', error);
//       throw error;
//     }
//   };

//   /**
//    * Sign up a new user. Depending on your flow, you may sign in automatically after signup.
//    * @param {Object} userData 
//    */
//   const signUp = async (userData) => {
//     try {
//       const response = await fetch('/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         // Optionally, you can automatically sign in the user after signup.
//         setUser(data.user);
//         setAccessToken(data.accessToken);
//       } else {
//         throw new Error(data.message || 'Sign up failed');
//       }
//     } catch (error) {
//       console.error('Sign up error:', error);
//       throw error;
//     }
//   };

//   /**
//    * Sign out the user by calling the backend to clear any session data and then resetting client state.
//    */
//   const signOut = async () => {
//     try {
//       await fetch('/api/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       setAccessToken(null);
//     }
//   };

//   /**
//    * When the app loads, check if the user is already authenticated.
//    * For example, you might have an endpoint that returns the current user data if a valid session exists.
//    */
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const response = await fetch('/api/me', {
//           method: 'GET',
//           credentials: 'include', // so cookies (if any) are sent with the request
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUser(data.user);
//           setAccessToken(data.accessToken);
//         }
//       } catch (error) {
//         console.error('Error fetching current user', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   /**
//    * Optional: Automatically refresh the access token before it expires.
//    * This uses the expiry timestamp from the JWT (if using JWT for your access token).
//    */
//   useEffect(() => {
//     let timeout;
//     if (accessToken) {
//       // Decode the JWT payload to determine expiration.
//       // (This assumes your token is a JWT in the standard format.)
//       const tokenParts = accessToken.split('.');
//       if (tokenParts.length === 3) {
//         try {
//           const payload = JSON.parse(atob(tokenParts[1]));
//           const expiry = payload.exp * 1000; // Convert seconds to milliseconds.
//           const now = Date.now();
//           // Refresh one minute before expiry (adjust as needed).
//           const timeoutDuration = expiry - now - 60000;
//           if (timeoutDuration > 0) {
//             timeout = setTimeout(() => {
//               refreshAccessToken();
//             }, timeoutDuration);
//           } else {
//             // Token is about to expire or already expired.
//             refreshAccessToken();
//           }
//         } catch (error) {
//           console.error('Failed to parse token for auto-refresh', error);
//         }
//       }
//     }
//     return () => clearTimeout(timeout);
//   }, [accessToken]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         accessToken,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         refreshAccessToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };