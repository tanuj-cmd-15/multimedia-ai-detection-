import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiUserAdd, HiUserCircle, HiOfficeBuilding } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { register as apiRegister } from '../services/api'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'INDIVIDUAL',
    organizationName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.userType === 'ORGANIZATION' && !formData.organizationName) {
      setError('Organization name is required')
      return
    }

    setLoading(true)

    try {
      const response = await apiRegister({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: formData.userType,
        organizationName: formData.organizationName || null
      })
      login(response)
      navigate('/detection')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <HiUserAdd className="text-6xl text-accent-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Get unlimited access to audio deepfake detection</p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'INDIVIDUAL' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.userType === 'INDIVIDUAL'
                      ? 'border-accent-blue bg-accent-blue/10'
                      : 'border-navy-600 hover:border-navy-500'
                  }`}
                >
                  <HiUserCircle className="text-3xl mx-auto mb-2" />
                  <p className="font-semibold">Individual</p>
                  <p className="text-xs text-gray-400 mt-1">Personal use</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'ORGANIZATION' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.userType === 'ORGANIZATION'
                      ? 'border-accent-blue bg-accent-blue/10'
                      : 'border-navy-600 hover:border-navy-500'
                  }`}
                >
                  <HiOfficeBuilding className="text-3xl mx-auto mb-2" />
                  <p className="font-semibold">Organization</p>
                  <p className="text-xs text-gray-400 mt-1">Business use</p>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Organization Name (conditional) */}
            {formData.userType === 'ORGANIZATION' && (
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="Your Company Inc."
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-blue hover:underline font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
