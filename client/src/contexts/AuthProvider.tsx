import React, { useState, useEffect } from 'react'
import { AuthContext } from '../hooks/Auth'
import { User } from '../types';
import axios from 'axios';

type AuthProviderProps = {} & React.PropsWithChildren

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    async function fetchUser() {
      const prevUser = localStorage.getItem('user'); // Example: check if user exists in localStorage
      if (user !== null) {
        if (document.cookie.includes('accessToken')) {
           await axios.get('/api/v1/auth/getUser')
        }
        // setUser(JSON.parse(prevUser) as User)
        setUser({
            isAuthenticated: true,
          }
        )
      }
      else {
        setUser({
            isAuthenticated: true,
          }
        )
      }
    }
    fetchUser()
    .then(() => console.log('User fetched'))
    .catch((err) => console.log(err))
  }, []);

  const signIn = () => {
    localStorage.setItem('user', JSON.stringify({ username: 'user' })); // Example: store user data
  };

  const signOut = () => {
    localStorage.removeItem('user');
  };

  

  return (
    <AuthContext.Provider value={ user }>
      { children }
    </AuthContext.Provider>
  );
};