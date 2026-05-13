import { AppProvider, useApp } from './context/AppContext'
import Loading from './components/ui/Loading'
import Toast from './components/ui/Toast'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import AdminLoginPage from './components/auth/AdminLoginPage'
import UserDashboard from './components/user/UserDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

function AppInner() {
  const { page, loading, loadTxt, toast } = useApp()

  return (
    <>
      {loading && <Loading txt={loadTxt} />}
      {toast   && <Toast msg={toast} />}

      {page === 'login'       && <LoginPage />}
      {page === 'register'    && <RegisterPage />}
      {page === 'admin-login' && <AdminLoginPage />}
      {page === 'user-dash'   && <UserDashboard />}
      {page === 'admin-dash'  && <AdminDashboard />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
