import React, { useState, useEffect } from 'react'
import { Plus, X, LinkIcon, Clock, Calendar, BarChart3, PauseCircle } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import type { ProfileLink, Activity } from '../types'

interface ActivityFeedProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ onAddToast }) => {
  const { getProfileLinks, addProfileLink, deleteProfileLink, getActivities, addActivity } = useStorage()
  const [profiles, setProfiles] = useState<ProfileLink[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const [platformType, setPlatformType] = useState<'unstop' | 'internshala'>('unstop')
  const [profileName, setProfileName] = useState('')
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Week')

  useEffect(() => {
    setProfiles(getProfileLinks())
    setActivities(getActivities().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
  }, [])

  // Refresh activities every 5 seconds to catch new items
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedActivities = getActivities().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setActivities(updatedActivities)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLinkProfile = () => {
    if (!profileUrl || !profileName) {
      onAddToast('Please fill in all fields', 'warning')
      return
    }

    const newProfile: ProfileLink = {
      id: Math.random().toString(36).substr(2, 9),
      platform: platformType,
      profileUrl,
      profileName,
      linkedAt: new Date().toISOString(),
      isActive: true,
    }

    addProfileLink(newProfile)
    setProfiles([...profiles, newProfile])

    const sampleActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      profileId: newProfile.id,
      platform: platformType,
      type: 'update',
      title: `Connected ${platformType} profile`,
      description: `Successfully linked your ${platformType} profile: ${profileName}`,
      timestamp: new Date().toISOString(),
      metadata: { status: 'connected' },
    }

    addActivity(sampleActivity)
    setActivities([sampleActivity, ...activities])

    setProfileUrl('')
    setProfileName('')
    setShowLinkModal(false)
    onAddToast(`${platformType} profile linked successfully!`, 'success')
  }

  const handleRemoveProfile = (id: string) => {
    deleteProfileLink(id)
    setProfiles(profiles.filter(p => p.id !== id))
    onAddToast('Profile removed', 'success')
  }

  // Calculate metrics
  const totalActivities = activities.length
  const unstopActivities = activities.filter(a => a.platform === 'unstop').length
  const internshalaActivities = activities.filter(a => a.platform === 'internshala').length
  const totalHours = Math.floor(totalActivities * 0.5) // Mock: ~30 min per activity
  const totalMinutes = (totalActivities % 2) * 30
  const productiveHours = Math.floor(totalActivities * 0.35)
  const focusedMinutes = (totalActivities * 10) % 60
  const unproductiveMinutes = totalActivities % 10

  // Heatmap data: 24 hours
  const generateHourlyHeatmap = () => {
    const hours: { hour: number; value: number; label: string }[] = []
    for (let h = 10; h <= 24; h++) {
      const hour24 = h === 24 ? 0 : h
      const label = hour24 < 12 ? `${hour24 === 0 ? 12 : hour24} AM` : `${hour24 === 12 ? 12 : hour24 - 12} PM`
      const activitiesInHour = activities.filter(a => {
        const date = new Date(a.timestamp)
        return date.getHours() === hour24
      })
      hours.push({ hour: h, value: activitiesInHour.length, label })
    }
    // Add hours from 1 AM to 9 AM
    for (let h = 1; h <= 9; h++) {
      const label = `${h} AM`
      const activitiesInHour = activities.filter(a => {
        const date = new Date(a.timestamp)
        return date.getHours() === h
      })
      hours.push({ hour: h, value: activitiesInHour.length, label })
    }
    for (let h = 24; h <= 24; h++) {
      hours.push({ hour: 24, value: 0, label: '01 AM' })
    }
    return hours.slice(0, 15)
  }

  const hourlyData = generateHourlyHeatmap()
  const maxValue = Math.max(...hourlyData.map(h => h.value), 1)

  const getHeatColor = (value: number) => {
    if (value === 0) return 'bg-yellow-100'
    const intensity = Math.min(value / maxValue, 1)
    if (intensity < 0.25) return 'bg-green-100'
    if (intensity < 0.5) return 'bg-green-300'
    if (intensity < 0.75) return 'bg-blue-300'
    return 'bg-blue-600'
  }

  const recentSessions = activities.slice(0, 8)

  return (
    <div className="flex-1 overflow-auto pb-24 md:pb-8 relative bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      {/* Gradient Background with Decorative Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative blur circles */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-40 scale-40"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30 scale-50"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-40 scale-60"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                Activity Feed
              </h1>
              <p className="text-lg text-gray-700 mt-2">Track your Unstop & Internshala progress</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-lg">
                {(['Day', 'Week', 'Month'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition font-semibold"
              >
                <Plus size={18} /> Link
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Heatmap */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar size={22} className="text-pink-600" /> Activity Timeline
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-4">
              {hourlyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`h-12 w-8 rounded-lg ${getHeatColor(item.value)} shadow-md cursor-pointer hover:ring-2 hover:ring-purple-500 transition`}
                    title={`${item.label}: ${item.value} activities`}
                  ></div>
                  <span className="text-xs text-gray-700 mt-2 whitespace-nowrap font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
            <p className="text-sm text-gray-700 font-medium">
              <strong>Peak activity:</strong> {Math.max(...hourlyData.map(h => h.value)) > 0 ? '2-3 PM' : 'No data'} | <strong>Total tracked:</strong> {totalActivities} activities
            </p>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Working Hours (Left) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Working Hours</h3>
            </div>
            <p className="text-4xl font-black text-blue-600">{totalHours}h {totalMinutes}m</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">Total Time Tracked</p>

            {/* Mini Heatmap Grid */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const intensity = Math.random()
                  let bgColor = 'bg-yellow-100'
                  if (intensity > 0.7) bgColor = 'bg-gradient-to-br from-orange-400 to-orange-500'
                  else if (intensity > 0.5) bgColor = 'bg-gradient-to-br from-green-400 to-green-500'
                  else if (intensity > 0.3) bgColor = 'bg-gradient-to-br from-blue-300 to-blue-400'
                  return <div key={idx} className={`h-3 w-3 rounded ${bgColor}`}></div>
                })}
              </div>
              <p className="text-xs text-gray-700 mt-3 font-medium">28 days history</p>
            </div>

            <button className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition font-semibold text-sm flex items-center justify-center gap-2">
              <span>▶</span> Start Tracking
            </button>
          </div>

          {/* Time Breakdown (Middle) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">Time Breakdown</h3>
            </div>

            <div className="space-y-4">
              {/* Productive Hours */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-md"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{productiveHours}h {Math.floor((productiveHours * 45) % 60)}m</p>
                  <p className="text-xs text-gray-600 font-medium">Productive Hours</p>
                </div>
              </div>

              {/* Focused Time */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-md"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">2h {focusedMinutes}m</p>
                  <p className="text-xs text-gray-600 font-medium">Focused Time</p>
                </div>
              </div>

              {/* Unproductive */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{unproductiveMinutes}m</p>
                  <p className="text-xs text-gray-600 font-medium">Unproductive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Apps Used (Right) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Platforms Used</h3>
            <div className="space-y-3">
              {profiles.length > 0 ? (
                profiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg hover:shadow-md transition border border-pink-200">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{profile.profileName}</p>
                      <p className="text-xs text-gray-600 capitalize font-medium">{profile.platform}</p>
                    </div>
                    <button onClick={() => handleRemoveProfile(profile.id)} className="text-red-500 hover:text-red-700 transition">
                      <X size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm font-medium">No platforms linked yet</p>
              )}
            </div>
            <button
              onClick={() => setShowLinkModal(true)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold text-sm"
            >
              Link Platform
            </button>
          </div>
        </div>

        {/* Break Timer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <PauseCircle size={18} className="text-gray-600" />
              <h3 className="text-lg font-bold text-gray-800">Break Timer</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">2 / 3.5</p>
            <p className="text-sm text-gray-600 mt-1">Break VS Work Ratio</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Sessions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Sessions</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentSessions.length > 0 ? (
                recentSessions.map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{session.title}</p>
                      <p className="text-xs text-gray-600">{new Date(session.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${session.platform === 'unstop' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                        {session.platform}
                      </span>
                      <span className="text-xs text-gray-600">1 min</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No sessions recorded</p>
              )}
            </div>
          </div>
        </div>

        {/* Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Link Profile</h2>
                <button onClick={() => setShowLinkModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
                  <select
                    value={platformType}
                    onChange={(e) => setPlatformType(e.target.value as 'unstop' | 'internshala')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unstop">Unstop</option>
                    <option value="internshala">Internshala</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Name</label>
                  <input
                    type="text"
                    placeholder="e.g., My Unstop Profile"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://unstop.com/..."
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLinkProfile}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

