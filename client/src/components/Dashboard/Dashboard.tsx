import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/Auth'

export default function Dashboard() {
  const user = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (user === null) navigate('/signin', { replace: true })
  }, [user])
  return (
    <div>
      Dashboard
    </div>
  )
}
