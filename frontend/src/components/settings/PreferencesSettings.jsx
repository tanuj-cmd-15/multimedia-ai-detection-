import React from 'react'
import { HiGlobe, HiColorSwatch, HiClock } from 'react-icons/hi'

const PreferencesSettings = () => {
  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
          <HiGlobe className="text-accent-blue" />
          <span>Language & Region</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
            <select className="input-field">
              <option>English (US)</option>
              <option>हिन्दी (Hindi)</option>
              <option>मराठी (Marathi)</option>
              <option>বাংলা (Bengali)</option>
              <option>ગુજરાતી (Gujarati)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
            <select className="input-field">
              <option>Asia/Kolkata (IST - UTC+5:30)</option>
              <option>America/New_York (EST - UTC-5)</option>
              <option>Europe/London (GMT - UTC+0)</option>
              <option>Asia/Tokyo (JST - UTC+9)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date Format</label>
            <select className="input-field">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Time Format</label>
            <select className="input-field">
              <option>12-hour (AM/PM)</option>
              <option>24-hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
          <HiColorSwatch className="text-accent-blue" />
          <span>Appearance</span>
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {['Dark', 'Light', 'Auto'].map((theme) => (
                <label
                  key={theme}
                  className="relative p-4 border-2 border-navy-600 rounded-lg cursor-pointer hover:border-accent-blue transition-colors"
                >
                  <input type="radio" name="theme" value={theme} defaultChecked={theme === 'Dark'} className="sr-only" />
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-lg mb-2 ${
                      theme === 'Dark' ? 'bg-navy-900' : theme === 'Light' ? 'bg-white' : 'bg-gradient-to-br from-navy-900 to-white'
                    }`}></div>
                    <p className="font-medium">{theme}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Accent Color</label>
            <div className="flex space-x-3">
              {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full border-2 border-navy-600 hover:border-white transition-colors"
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-6">Display Settings</h3>
        <div className="space-y-4">
          {[
            { label: 'Compact Mode', description: 'Display more content on screen' },
            { label: 'Show Animations', description: 'Enable UI animations and transitions' },
            { label: 'High Contrast', description: 'Increase contrast for better visibility' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
              <div>
                <h4 className="font-semibold mb-1">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={i === 1} />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">Save Preferences</button>
      </div>
    </div>
  )
}

export default PreferencesSettings
