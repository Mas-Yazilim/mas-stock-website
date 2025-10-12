import { Routes, Route } from 'react-router-dom'
import Layout from '@/shared/components/Layout'
import ProductListPage from '@/pages/ProductListPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/liste" element={<ProductListPage />} />
      </Routes>
    </Layout>
  )
}

export default App
