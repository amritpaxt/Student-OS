import React, { useEffect, useState } from 'react'
import { Settings, Flame, Play, PauseCircle, ArrowRight, Zap, Target, Award } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import type { AppMode } from '../types'

interface DashboardProps {
  mode: AppMode
  streak: number
  onModeChange: (mode: AppMode) => void
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const Dashboard: React.FC<DashboardProps> = ({ mode, streak, onModeChange, onAddToast }) => {
  const { getDeadlines, getHackathons, getInternships, updateSettings } = useStorage()
  const [pulseScore, setPulseScore] = useState(0)
  const [focusSprintActive, setFocusSprintActive] = useState(false)
  const [sprintTime, setSprintTime] = useState(0)
  const [stats, setStats] = useState({ hacks: 0, internships: 0, deadlines: 0 })

  useEffect(() => {
    const hacks = getHackathons()
    const internships = getInternships()
    const deadlines = getDeadlines()

    setStats({
      hacks: hacks.length,
      internships: internships.length,
      deadlines: deadlines.length,
    })

    // Calculate pulse score
    const urgentDeadlines = deadlines.filter((d: any) => !d.completed).length
    const pulseValue = Math.min(100, (urgentDeadlines * 20 + internships.length * 15 + hacks.length * 10))
    setPulseScore(pulseValue)
  }, [])

  const toggleFocusSprint = () => {
    setFocusSprintActive(!focusSprintActive)
    onAddToast(focusSprintActive ? 'Focus Sprint paused' : 'Focus Sprint started!', 'success')
  }

  useEffect(() => {
    if (!focusSprintActive) return

    const interval = setInterval(() => {
      setSprintTime(prev => (prev < 1500 ? prev + 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [focusSprintActive])

  const formatSprintTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
      <div className="relative z-10 p-4 md:p-8 space-y-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8">
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 leading-tight">
            Master Your Student Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Track hackathons, manage internships, hit deadlines—all in one powerful platform designed for your success.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => {
                onAddToast('Welcome to StudentOS! Start tracking your goals', 'success')
                onModeChange('hustle')
              }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap size={24} /> Get Started
            </button>
            <button
              onClick={() => {
                onAddToast('Tour started!', 'success')
              }}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-purple-600"
            >
              <ArrowRight size={24} /> Take a Tour
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Hackathons Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Hackathons</h3>
              <Target className="text-pink-500" size={24} />
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-black text-pink-600">{stats.hacks}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 transition-all"
                  style={{ width: `${Math.min((stats.hacks / 10) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Tracked & Completed</p>
            </div>
          </div>

          {/* Internships Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Internships</h3>
              <Award className="text-purple-500" size={24} />
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-black text-purple-600">{stats.internships}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 transition-all"
                  style={{ width: `${Math.min((stats.internships / 10) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">In Pipeline</p>
            </div>
          </div>

          {/* Deadlines Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Deadlines</h3>
              <Zap className="text-blue-500" size={24} />
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-black text-blue-600">{stats.deadlines}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                  style={{ width: `${Math.min((stats.deadlines / 15) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Active Tracking</p>
            </div>
          </div>
        </div>

        {/* Pulse Score Circle */}
        <div className="flex justify-center">
          <div className="relative w-40 h-40 bg-white/80 backdrop-blur rounded-full shadow-2xl flex items-center justify-center border-4 border-gradient-to-r from-pink-300 to-purple-300">
            <div className="text-center">
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                {pulseScore}%
              </p>
              <p className="text-sm font-semibold text-gray-600 mt-1">Activity Pulse</p>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-purple-500 opacity-40 animate-spin"></div>
          </div>
        </div>

        {/* Focus Sprint & Mode Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Focus Sprint */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
            <p className="text-sm font-semibold text-gray-600 mb-3">Focus Sprint</p>
            <p className="text-5xl font-mono font-bold text-blue-600 mb-6">{formatSprintTime(sprintTime)}</p>
            <button
              onClick={toggleFocusSprint}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                focusSprintActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
              }`}
            >
              {focusSprintActive ? 'Pause' : 'Start'} Sprint
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
            <p className="text-sm font-semibold text-gray-600 mb-4 text-center">Select Your Vibe</p>
            <div className="flex gap-3">
              {(['hustle', 'grind', 'chill'] as AppMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => {
                    onModeChange(m)
                    updateSettings({ currentMode: m })
                    onAddToast(`${m.toUpperCase()} mode activated!`, 'success')
                  }}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                    mode === m
                      ? `bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {m === 'hustle' && '🚀 Hustle'}
                  {m === 'grind' && '💪 Grind'}
                  {m === 'chill' && '🧘 Chill'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="flex justify-center pb-8">
          <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 text-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Your Streak</h3>
              <Flame size={28} />
            </div>
            <p className="text-6xl font-black">{streak}</p>
            <p className="text-sm opacity-90 mt-1">Days of Consistency</p>
            <p className="text-xs opacity-80 mt-4">Keep the momentum going! You're on fire 🔥</p>
          </div>
        </div>
      </div>
    </div>
  )
}
