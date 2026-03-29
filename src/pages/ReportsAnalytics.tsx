import React, { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, Award, Clock, Zap, Target } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'

interface ReportsAnalyticsProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ onAddToast }) => {
  const { getHackathons, getInternships, getDeadlines, getActivities, getSettings } = useStorage()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  const hackathons = getHackathons()
  const internships = getInternships()
  const deadlines = getDeadlines()
  const activities = getActivities()
  const settings = getSettings()

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalHackathons: hackathons.length,
      appliedInternships: internships.length,
      totalDeadlines: deadlines.length,
      completedDeadlines: deadlines.filter(d => d.completed).length,
      totalActivities: activities.length,
      currentStreak: settings.streak || 0,
      completionRate: deadlines.length > 0 ? Math.round((deadlines.filter(d => d.completed).length / deadlines.length) * 100) : 0,
      avgHoursPerDeadline: deadlines.length > 0 ? Math.round(deadlines.reduce((sum, d) => sum + d.hoursLogged, 0) / deadlines.length) : 0,
    }
  }, [hackathons, internships, deadlines, activities, settings])

  // Recent activity breakdown
  const activityBreakdown = useMemo(() => {
    const breakdown = {
      hackathon_added: activities.filter(a => a.type === 'hackathon_added').length,
      internship_added: activities.filter(a => a.type === 'internship_added').length,
      deadline_added: activities.filter(a => a.type === 'deadline_added').length,
      update: activities.filter(a => a.type === 'update').length,
      other: activities.filter(a => !['hackathon_added', 'internship_added', 'deadline_added', 'update'].includes(a.type)).length,
    }
    return breakdown
  }, [activities])

  // Internship stage breakdown
  const internshipStages = useMemo(() => {
    const stages: { [key: string]: number } = {}
    internships.forEach(i => {
      stages[i.stage] = (stages[i.stage] || 0) + 1
    })
    return stages
  }, [internships])

  // Hackathon status breakdown
  const hackathonStatuses = useMemo(() => {
    const statuses: { [key: string]: number } = {}
    hackathons.forEach(h => {
      statuses[h.status] = (statuses[h.status] || 0) + 1
    })
    return statuses
  }, [hackathons])

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-300 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">{title}</p>
          <p className={`text-4xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg')}/10`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  )

  const BreakdownCard = ({ title, items }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(items).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium capitalize text-sm">{label}</span>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-full px-3 py-1">
                <span className="font-bold text-purple-900 text-sm">{value as number}</span>
              </div>
              <div className={`h-2 rounded-full`} style={{ width: `${Math.max((value as number) / Math.max(...Object.values(items) as number[]) * 100, 5)}px`, backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 md:ml-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BarChart3 size={32} />
              <h1 className="text-3xl md:text-4xl font-bold">Reports & Analytics</h1>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    timeRange === range
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <p className="text-pink-100">Track your productivity and progress</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Zap}
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="days"
            color="text-red-600"
          />
          <StatCard
            icon={Target}
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            subtitle={`${stats.completedDeadlines}/${stats.totalDeadlines} done`}
            color="text-green-600"
          />
          <StatCard
            icon={Clock}
            title="Avg Hours/Deadline"
            value={stats.avgHoursPerDeadline}
            subtitle="hours logged"
            color="text-blue-600"
          />
          <StatCard
            icon={Award}
            title="Hackathons"
            value={stats.totalHackathons}
            subtitle="tracked"
            color="text-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Internships"
            value={stats.appliedInternships}
            subtitle="applications"
            color="text-pink-600"
          />
          <StatCard
            icon={BarChart3}
            title="Recent Activities"
            value={stats.totalActivities}
            subtitle="logged"
            color="text-amber-600"
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.keys(activityBreakdown).length > 0 && (
            <BreakdownCard
              title="Activity Breakdown"
              items={activityBreakdown}
            />
          )}

          {Object.keys(internshipStages).length > 0 && (
            <BreakdownCard
              title="Internship Stages"
              items={internshipStages}
            />
          )}

          {Object.keys(hackathonStatuses).length > 0 && (
            <BreakdownCard
              title="Hackathon Status"
              items={hackathonStatuses}
            />
          )}

          {/* Deadline Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Deadline Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Completed</span>
                  <span className="font-bold text-green-600">{stats.completedDeadlines}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Pending</span>
                  <span className="font-bold text-amber-600">{stats.totalDeadlines - stats.completedDeadlines}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${100 - stats.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-purple-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-semibold text-gray-900">Amazing Streak!</p>
                <p className="text-sm text-gray-700">Keep your {stats.currentStreak} day streak going</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-semibold text-gray-900">High Completion</p>
                <p className="text-sm text-gray-700">You're {stats.completionRate}% done with deadlines</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-semibold text-gray-900">Time Investment</p>
                <p className="text-sm text-gray-700">Averaging {stats.avgHoursPerDeadline} hours per deadline</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-semibold text-gray-900">Stay Focused</p>
                <p className="text-sm text-gray-700">Use Focus Mode to maximize productivity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
