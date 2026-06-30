import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiHome, HiShieldCheck, HiClipboardList, HiBookOpen, HiKey, HiLogin, HiUserAdd, HiLogout, HiUser, HiMenu, HiX } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const isActive = (path) => location.pathname === path
  
  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }
  
  return (
    <nav className="bg-navy-800 border-b border-navy-700 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <HiShieldCheck className="text-accent-blue text-3xl" />
            <span className="text-2xl font-bold gradient-text">
              SwarParikshan
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/')
                  ? 'bg-accent-blue text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <HiHome className="text-xl" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link
              to="/detection"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/detection')
                  ? 'bg-accent-blue text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <HiShieldCheck className="text-xl" />
              <span className="font-medium">Detection</span>
            </Link>
            
            <Link
              to="/history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/history')
                  ? 'bg-accent-blue text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <HiClipboardList className="text-xl" />
              <span className="font-medium">History</span>
            </Link>
            
            <Link
              to="/docs"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/docs')
                  ? 'bg-accent-blue text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <HiBookOpen className="text-xl" />
              <span className="font-medium">Docs</span>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors"
                >
                  <HiUser className="text-xl" />
                  <span className="font-medium">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-navy-800 border border-navy-700 rounded-lg shadow-xl py-2">
                    <div className="px-4 py-2 border-b border-navy-700">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="font-medium text-sm truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/api-keys"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-navy-700 transition-colors"
                    >
                      <HiKey className="text-lg" />
                      <span>API Keys</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-navy-700 transition-colors text-red-400"
                    >
                      <HiLogout className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  <HiLogin className="text-xl" />
                  <span className="font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <HiUserAdd className="text-xl" />
                  <span className="font-medium">Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-2xl text-gray-300 hover:text-white"
          >
            {showMobileMenu ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-navy-700">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 hover:bg-navy-700 rounded-lg">Home</Link>
              <Link to="/detection" className="px-4 py-2 hover:bg-navy-700 rounded-lg">Detection</Link>
              <Link to="/history" className="px-4 py-2 hover:bg-navy-700 rounded-lg">History</Link>
              <Link to="/docs" className="px-4 py-2 hover:bg-navy-700 rounded-lg">Docs</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/api-keys" className="px-4 py-2 hover:bg-navy-700 rounded-lg">API Keys</Link>
                  <button onClick={handleLogout} className="px-4 py-2 hover:bg-navy-700 rounded-lg text-left text-red-400">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 hover:bg-navy-700 rounded-lg">Login</Link>
                  <Link to="/register" className="px-4 py-2 bg-accent-blue rounded-lg">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
