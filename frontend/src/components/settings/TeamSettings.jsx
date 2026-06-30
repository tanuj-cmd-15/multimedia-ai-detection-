import React from 'react'
import { HiUserGroup, HiMail, HiPlus, HiPencil, HiTrash } from 'react-icons/hi'

const TeamSettings = () => {
  const teamMembers = [
    { name: 'John Doe', email: 'john@company.com', role: 'Owner', status: 'Active', joinedDate: '2024-01-01' },
    { name: 'Jane Smith', email: 'jane@company.com', role: 'Admin', status: 'Active', joinedDate: '2024-02-15' },
    { name: 'Bob Johnson', email: 'bob@company.com', role: 'Member', status: 'Active', joinedDate: '2024-03-20' },
    { name: 'Alice Brown', email: 'alice@company.com', role: 'Member', status: 'Pending', joinedDate: null }
  ]

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Team Members</h3>
            <p className="text-gray-400 text-sm">Manage your organization's team members and roles</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <HiPlus />
            <span>Invite Member</span>
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((member, i) => (
            <div key={i} className="p-4 bg-navy-700 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-purple-500 flex items-center justify-center text-lg font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {member.status}
                </span>
                <span className="text-sm text-gray-400 w-20">{member.role}</span>
                {member.role !== 'Owner' && (
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-navy-600 rounded transition-colors">
                      <HiPencil className="text-accent-blue" />
                    </button>
                    <button className="p-2 hover:bg-navy-600 rounded transition-colors">
                      <HiTrash className="text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Roles & Permissions</h3>
        <div className="space-y-4">
          {[
            { role: 'Owner', permissions: ['Full access', 'Billing', 'Delete organization'] },
            { role: 'Admin', permissions: ['Manage members', 'API keys', 'Settings'] },
            { role: 'Member', permissions: ['View analyses', 'Run detections'] }
          ].map((item) => (
            <div key={item.role} className="p-4 bg-navy-700 rounded-lg">
              <h4 className="font-semibold mb-2">{item.role}</h4>
              <ul className="space-y-1">
                {item.permissions.map((perm, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamSettings
