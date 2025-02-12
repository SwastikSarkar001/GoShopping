import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <main>
      <Navbar />
    </main>
  )
}
