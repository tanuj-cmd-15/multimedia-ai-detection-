import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiLogin, HiUserCircle, HiOfficeBuilding } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { login as apiLogin } from '../services/api'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiLogin({ email, password })
      login(response)
      navigate('/detection')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <HiLogin className="text-6xl text-accent-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Login to access unlimited detections</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-bold text-lg"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-blue hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-navy-700">
            <p className="text-sm text-gray-400 mb-4 font-semibold">Benefits of logging in:</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-start">
                <span className="text-accent-green mr-2">✓</span>
                Unlimited audio detections
              </li>
              <li className="flex items-start">
                <span className="text-accent-green mr-2">✓</span>
                Access to detailed analysis & suspicious regions
              </li>
              <li className="flex items-start">
                <span className="text-accent-green mr-2">✓</span>
                Personal detection history
              </li>
              <li className="flex items-start">
                <span className="text-accent-green mr-2">✓</span>
                API key for programmatic access
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
