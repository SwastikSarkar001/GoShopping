import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useAppSelector } from '../../states/store'
import GoToTop from '../Utilities/GoToTop'
import DashboardSidebar from './DashboardSidebar'

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

  const [scrolled, setScrolled] = useState(false)
  const handleScroll = () => {
    const scrollThreshold = window.innerHeight * 0.15; // 15% of viewport height
    if (window.scrollY > scrollThreshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }
  window.onscroll = handleScroll

  useEffect(() => {
    document.title = 'Plans and Pricing | eazzyBizz'
  }, [])
  
  return (
    <main className="text-text min-h-screen flex flex-col items-stretch">
      <DashboardSidebar />
      <GoToTop scrolled={scrolled} />
    </main>
  )
}
