import React from 'react'
import { HiCreditCard, HiDownload, HiCheckCircle } from 'react-icons/hi'

const BillingSettings = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['3 detections/day', 'Basic support', 'Community access'],
      current: true
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: ['Unlimited detections', 'Priority support', 'API access', 'Advanced analytics'],
      current: false,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: 'per month',
      features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'Team management'],
      current: false
    }
  ]

  const invoices = [
    { id: 'INV-2024-001', date: '2024-01-01', amount: '$29.00', status: 'paid' },
    { id: 'INV-2023-012', date: '2023-12-01', amount: '$29.00', status: 'paid' },
    { id: 'INV-2023-011', date: '2023-11-01', amount: '$29.00', status: 'paid' }
  ]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-6">Current Plan</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-lg border-2 ${
                plan.current
                  ? 'border-accent-blue bg-accent-blue/10'
                  : 'border-navy-600 bg-navy-700'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs rounded-full">
                  Popular
                </span>
              )}
              <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-400 text-sm">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm">
                    <HiCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg font-semibold ${
                  plan.current
                    ? 'bg-navy-600 text-gray-400 cursor-not-allowed'
                    : 'bg-accent-blue hover:bg-blue-600 text-white'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
          <div className="flex items-center space-x-4">
            <HiCreditCard className="text-3xl text-accent-blue" />
            <div>
              <p className="font-semibold">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-400">Expires 12/2025</p>
            </div>
          </div>
          <button className="text-accent-blue hover:underline text-sm">Update</button>
        </div>
        <button className="mt-4 text-accent-blue text-sm hover:underline">
          + Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Billing History</h3>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-navy-700 rounded-lg"
            >
              <div>
                <p className="font-semibold">{invoice.id}</p>
                <p className="text-sm text-gray-400">{invoice.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{invoice.amount}</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  {invoice.status}
                </span>
                <button className="text-accent-blue hover:text-blue-400">
                  <HiDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BillingSettings
