import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('swarparikshan_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('swarparikshan_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('swarparikshan_user')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('swarparikshan_user', JSON.stringify(userData))
  }

  const getMachineId = () => {
    let machineId = localStorage.getItem('swarparikshan_machine_id')
    if (!machineId) {
      machineId = 'machine_' + Math.random().toString(36).substring(2, 15) + Date.now()
      localStorage.setItem('swarparikshan_machine_id', machineId)
    }
    return machineId
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    getMachineId,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
