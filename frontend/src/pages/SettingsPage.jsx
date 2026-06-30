import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiUser, 
  HiKey, 
  HiShieldCheck, 
  HiBell, 
  HiGlobe, 
  HiColorSwatch,
  HiCode,
  HiCreditCard,
  HiUserGroup,
  HiChartBar,
  HiDatabase,
  HiCog,
  HiLockClosed,
  HiDocumentText
} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Import setting components
import AccountSettings from '../components/settings/AccountSettings'
import SecuritySettings from '../components/settings/SecuritySettings'
import APISettings from '../components/settings/APISettings'
import NotificationSettings from '../components/settings/NotificationSettings'
import BillingSettings from '../components/settings/BillingSettings'
import TeamSettings from '../components/settings/TeamSettings'
import UsageSettings from '../components/settings/UsageSettings'
import IntegrationSettings from '../components/settings/IntegrationSettings'
import PreferencesSettings from '../components/settings/PreferencesSettings'
import PrivacySettings from '../components/settings/PrivacySettings'
import AuditLogSettings from '../components/settings/AuditLogSettings'
import DataManagementSettings from '../components/settings/DataManagementSettings'

const SettingsPage = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const settingsTabs = [
    {
      id: 'account',
      label: 'Account',
      icon: HiUser,
      description: 'Manage your account information',
      component: AccountSettings
    },
    {
      id: 'security',
      label: 'Security',
      icon: HiShieldCheck,
      description: 'Password, 2FA, and security settings',
      component: SecuritySettings
    },
    {
      id: 'api',
      label: 'API Keys',
      icon: HiKey,
      description: 'Manage API keys and tokens',
      component: APISettings
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: HiBell,
      description: 'Email and push notification preferences',
      component: NotificationSettings
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: HiCreditCard,
      description: 'Subscription and payment methods',
      component: BillingSettings,
      badge: user?.userType === 'INDIVIDUAL' ? 'Pro' : null
    },
    {
      id: 'team',
      label: 'Team',
      icon: HiUserGroup,
      description: 'Manage team members and roles',
      component: TeamSettings,
      hidden: user?.userType !== 'ORGANIZATION'
    },
    {
      id: 'usage',
      label: 'Usage & Quotas',
      icon: HiChartBar,
      description: 'API usage and rate limits',
      component: UsageSettings
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: HiCode,
      description: 'Third-party integrations and webhooks',
      component: IntegrationSettings
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: HiColorSwatch,
      description: 'Language, theme, and display options',
      component: PreferencesSettings
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: HiLockClosed,
      description: 'Data privacy and sharing settings',
      component: PrivacySettings
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: HiDocumentText,
      description: 'View account activity history',
      component: AuditLogSettings
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: HiDatabase,
      description: 'Export, import, and delete data',
      component: DataManagementSettings
    }
  ].filter(tab => !tab.hidden)

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <HiCog className="text-4xl text-accent-blue" />
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">Settings</span>
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-dark p-4 sticky top-20"
            >
              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                        activeTab === tab.id
                          ? 'bg-accent-blue text-white'
                          : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                      }`}
                    >
                      <Icon className="text-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{tab.label}</span>
                          {tab.badge && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                              {tab.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </motion.div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Tab Header */}
                <div className="card-dark p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent-blue/10 rounded-lg">
                      {React.createElement(activeTabData.icon, { 
                        className: "text-3xl text-accent-blue" 
                      })}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">
                        {activeTabData.label}
                      </h2>
                      <p className="text-gray-400">
                        {activeTabData.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                {ActiveComponent && <ActiveComponent />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
