import React, { useState, useEffect } from 'react'
import { AuthContext } from '../hooks/Auth'
import { User } from '../types';

type AuthProviderProps = {} & React.PropsWithChildren

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const prevUser = localStorage.getItem('user'); // Example: check if user exists in localStorage
    if (user !== null) {
      // setUser(JSON.parse(prevUser) as User)
      setUser({
          isAuthenticated: true,
          id: 'abcd'
        }
      )
    }
    else {
      setUser({
          isAuthenticated: true,
          id: 'abcd'
        }
      )
    }
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