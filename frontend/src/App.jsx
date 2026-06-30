import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DetectionPage from './pages/DetectionPage'
import HistoryPage from './pages/HistoryPage'
import DocsPage from './pages/DocsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ApiKeysPage from './pages/ApiKeysPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-navy-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
