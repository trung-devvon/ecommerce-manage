
import { useAppSelector } from '@/hooks/useApp'
import NotFound from '@/pages/NotFound'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const Layout = () => {
  const { current } = useAppSelector(state => state.user)
  const navigate = useNavigate()
  if (current?.active) return <NotFound />
  return (
    <div className='bg-white h-screen overflow-hidden pt-8'>
        <Outlet />
    </div>
  )
}

export default Layout