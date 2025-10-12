import { Routes, Route } from 'react-router-dom'
import Layout from '@/shared/components/Layout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import { useAuthStore } from '@/stores/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Layout>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/" element={<LoginPage />} />
        ) : (
          <Route path="/" element={<DashboardPage />} />
        )}
      </Routes>
    </Layout>
  )
}

export default App
