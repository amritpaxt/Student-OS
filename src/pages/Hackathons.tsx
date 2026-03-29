import React, { useState, useMemo } from 'react'
import { ExternalLink, Trash2, Edit } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import { useCountdown, formatCountdown, getCountdownColor } from '../hooks/useCountdown'
import type { Hackathon } from '../types'

interface HackathonsProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

type FilterType = 'All' | 'Live' | 'Upcoming' | 'Completed'

export const Hackathons: React.FC<HackathonsProps> = ({ onAddToast }) => {
  const { getHackathons, updateHackathon, deleteHackathon } = useStorage()
  const [hackathons, setHackathons] = useState<Hackathon[]>(getHackathons())
  const [filter, setFilter] = useState<FilterType>('All')
  const [selectedHack, setSelectedHack] = useState<Hackathon | null>(null)
  const [editMode, setEditMode] = useState(false)

  const filteredHacks = useMemo(() => {
    const now = new Date().getTime()
    return hackathons.filter(h => {
      switch (filter) {
        case 'Live':
          return h.status === 'Live'
        case 'Upcoming':
          return (new Date(h.deadline).getTime() > now) && h.status !== 'Live' && h.status !== 'Result'
        case 'Completed':
          return h.status === 'Result'
        default:
          return true
      }
    })
  }, [hackathons, filter])

  const stats = {
    total: hackathons.length,
    applied: hackathons.filter(h => h.status === 'Applied').length,
    wins: hackathons.filter(h => h.status === 'Result').length,
  }

  const handleDelete = (id: string) => {
    deleteHackathon(id)
    setHackathons(getHackathons())
    onAddToast('Hackathon deleted', 'success')
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
      <div className="relative z-10 p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-2 pt-4">
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
            Hackathons
          </h1>
          <p className="text-lg text-gray-700">Track your hacking journey and showcase your wins</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Hackathons */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-semibold">Total</p>
              <span className="text-3xl">🚀</span>
            </div>
            <p className="text-4xl font-black text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-2">Hackathons tracked</p>
          </div>

          {/* Applied */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-semibold">Applied</p>
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-4xl font-black text-purple-600">{stats.applied}</p>
            <p className="text-sm text-gray-600 mt-2">In progress</p>
          </div>

          {/* Wins */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-semibold">Wins</p>
              <span className="text-3xl">🏆</span>
            </div>
            <p className="text-4xl font-black text-pink-600">{stats.wins}</p>
            <p className="text-sm text-gray-600 mt-2">Results received</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['All', 'Live', 'Upcoming', 'Completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHacks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg font-semibold">No hackathons yet. Start hacking! 🚀</p>
            </div>
          ) : (
            filteredHacks.map(hack => (
              <HackathonCard
                key={hack.id}
                hack={hack}
                onSelect={() => setSelectedHack(hack)}
              onDelete={() => handleDelete(hack.id)}
            />
          ))
        )}
      </div>

      {/* Expanded View Modal */}
      {selectedHack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-800">{selectedHack.name}</h2>
              <button onClick={() => setSelectedHack(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200">
                <p className="font-semibold mb-2 text-gray-800">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHack.stack.map(tech => (
                    <span key={tech} className="bg-gradient-to-r from-pink-200 to-purple-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Add post-hack reflection..."
                defaultValue={selectedHack.reflection || ''}
                onChange={(e) => {
                  updateHackathon(selectedHack.id, { reflection: e.target.value })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none h-20 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              />

              {selectedHack.result && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <p className="font-semibold text-gray-800">Result</p>
                  <p className="text-green-700">{selectedHack.result}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedHack(null)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

const HackathonCard: React.FC<{ hack: Hackathon; onSelect: () => void; onDelete: () => void }> = ({
  hack,
  onSelect,
  onDelete,
}) => {
  const countdown = useCountdown(hack.deadline)
  const colorClass = getCountdownColor(countdown.days, countdown.hours)

  const statusColors: Record<string, string> = {
    Discover: 'bg-blue-100 text-blue-800',
    Applied: 'bg-purple-100 text-purple-800',
    Registered: 'bg-cyan-100 text-cyan-800',
    Live: 'bg-green-100 text-green-800 animate-pulse',
    Result: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all p-6 cursor-pointer" onClick={onSelect}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-gray-800">{hack.name}</h3>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[hack.status]}`}>
            {hack.status}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-gray-300 hover:text-red-500 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <div className={`text-center py-2 rounded-lg font-bold text-sm ${colorClass}`}>
          {countdown.isExpired ? 'Ended' : formatCountdown(countdown.days, countdown.hours, countdown.minutes, countdown.seconds)}
        </div>

        {hack.team.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-2">Team</p>
            <div className="flex flex-wrap gap-2">
              {hack.team.map(member => (
                <span key={member.name} className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {hack.stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hack.stack.slice(0, 3).map(tech => (
              <span key={tech} className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {tech}
              </span>
            ))}
            {hack.stack.length > 3 && <span className="text-xs text-gray-500 font-medium">+{hack.stack.length - 3} more</span>}
          </div>
        )}

        <p className="text-xs text-gray-600 font-medium">⏱️ {hack.hoursLogged}h logged</p>
      </div>
    </div>
  )
}
