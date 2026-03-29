import React, { useState } from 'react'
import { Settings, Save, AlertCircle, Bell, Palette, Lock, Trash2 } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import type { AppMode } from '../types'

interface WorkspaceSettingsProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ onAddToast }) => {
  const { getSettings, updateSettings } = useStorage()
  const settings = getSettings()

  const [formData, setFormData] = useState({
    workspaceName: 'Panze Workspace',
    currentMode: settings.currentMode as AppMode,
    theme: 'gradient' as 'gradient' | 'dark' | 'light',
    notificationsEnabled: true,
    soundEnabled: true,
    emailNotifications: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      updateSettings({ currentMode: formData.currentMode })
      setIsSaving(false)
      onAddToast('Settings saved successfully!', 'success')
    }, 1000)
  }

  const handleExportData = () => {
    const data = {
      hackathons: localStorage.getItem('studentos_hackathons'),
      internships: localStorage.getItem('studentos_internships'),
      deadlines: localStorage.getItem('studentos_deadlines'),
      activities: localStorage.getItem('studentos_activities'),
      settings: localStorage.getItem('studentos_settings'),
      sprints: localStorage.getItem('studentos_sprints'),
      wins: localStorage.getItem('studentos_wins'),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `studentos-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    onAddToast('Data exported successfully!', 'success')
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will delete all your data permanently.')) {
      localStorage.clear()
      onAddToast('All data cleared', 'success')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 md:ml-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Settings size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Workspace Settings</h1>
          </div>
          <p className="text-pink-100">Customize your StudentOS experience</p>
        </div>
      </div>

      {/* Settings */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Workspace Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Palette size={24} className="text-purple-600" />
            Workspace
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Workspace Name</label>
              <input
                type="text"
                value={formData.workspaceName}
                onChange={(e) => handleChange('workspaceName', e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Productivity Mode</label>
              <div className="grid grid-cols-3 gap-4">
                {(['hustle', 'grind', 'chill'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleChange('currentMode', mode)}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      formData.currentMode === mode
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    {mode === 'hustle' && '🔥'} {mode === 'grind' && '💪'} {mode === 'chill' && '😎'}
                    <div className="uppercase text-xs mt-1">{mode}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 rounded-lg border-2 border-purple-500 bg-gradient-to-br from-pink-100 to-purple-100 font-semibold text-gray-900">
                  Gradient (Active)
                </button>
                <button disabled className="p-4 rounded-lg border-2 border-gray-300 bg-gray-100 font-semibold text-gray-400 opacity-50 cursor-not-allowed">
                  Dark
                </button>
                <button disabled className="p-4 rounded-lg border-2 border-gray-300 bg-white font-semibold text-gray-400 opacity-50 cursor-not-allowed">
                  Light
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">More themes coming soon!</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bell size={24} className="text-purple-600" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div>
                <p className="font-semibold text-gray-900">Browser Notifications</p>
                <p className="text-sm text-gray-600">Get notified about deadlines and events</p>
              </div>
              <button
                onClick={() => handleChange('notificationsEnabled', !formData.notificationsEnabled)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  formData.notificationsEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {formData.notificationsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div>
                <p className="font-semibold text-gray-900">Sound Notifications</p>
                <p className="text-sm text-gray-600">Play sound for notifications</p>
              </div>
              <button
                onClick={() => handleChange('soundEnabled', !formData.soundEnabled)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  formData.soundEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {formData.soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Weekly summary and important updates</p>
              </div>
              <button
                onClick={() => handleChange('emailNotifications', !formData.emailNotifications)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  formData.emailNotifications
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {formData.emailNotifications ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={24} className="text-purple-600" />
            Data Management
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Export All Data (JSON)
            </button>

            <button
              onClick={handleClearData}
              className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Clear All Data
            </button>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Your data is stored locally in this browser. Exporting is recommended for backup. Clearing data cannot be undone.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2 mb-6"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
