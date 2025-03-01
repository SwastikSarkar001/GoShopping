import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Navbar from '../Features/Navbar'
import { useAppSelector } from '../../states/store'

export default function Dashboard() {
  const user = useAuth()
  const navigate = useNavigate()
  const loading = useAppSelector(state => state.user.loading)
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth', { replace: true })
      }
    }
  }, [user])  // eslint-disable-line
  return (
    <main className='text-text'>
      <Navbar />
      <h1 className='text-3xl'>Dashboard</h1>
      <p>Welcome {user?.firstName}!</p>
      <Link to='/create-user' className='text-blue-500'>Click here to manage user</Link>
    </main>
  )
}
