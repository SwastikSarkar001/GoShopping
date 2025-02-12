import { lazy, useEffect } from 'react'

const HomePage = lazy(() => import('./Landing Page/HomePage'))
const Features = lazy(() => import('./Features/Features'))
const Feature = lazy(() => import('./Features/Feature'))
const InvalidPage = lazy(() => import('./Utilities/InvalidPage'))
const AuthenticationPage = lazy(() => import('./Authentication/AuthenticationPage'))
const Dashboard = lazy(() => import('./Dashboard/Dashboard'))

import { Toaster } from 'sonner'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Pricing from './Prices/Pricing'
import { useAppDispatch, useAppSelector } from '../states/store'
import { getInitUserProfile } from '../states/reducers/userSlice'

const router = createBrowserRouter([{
      path: '/',
      element: <HomePage />,
      errorElement: <InvalidPage />
    }, {
      path: '/features',
      element: <Features />
    }, {
      path: '/features/:featureID',
      element: <Feature />,
      errorElement: <InvalidPage />
    }, {
      path: '/plans',
      element: <Pricing />
    }, {
      path: '/auth',
      element: <AuthenticationPage />
    }, {
      path: '/dashboard',
      element: <Dashboard />,
    }
  ], {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true
    }
  }
)

export default function App() {
  const theme = useAppSelector(state => state.theme.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', '')
    }
  }, [theme])

  window.onload = () => dispatch(getInitUserProfile())

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-center' richColors closeButton duration={6000} />
    </>
  )
}