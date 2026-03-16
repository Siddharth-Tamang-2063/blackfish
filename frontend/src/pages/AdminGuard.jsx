import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

export default function AdminGuard({ children }) {
  const { isLoggedIn } = useAdmin()
  if (!isLoggedIn) return <Navigate to="/admin" replace />
  return children
}
