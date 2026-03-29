import React, { useState, useMemo } from 'react'
import { Trash2, Pin, Trophy } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import type { Hackathon, Internship, Deadline, Win } from '../types'

interface ArchiveProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

type FilterType = 'All' | 'Hacks' | 'Internships' | 'Deadlines'

export const Archive: React.FC<ArchiveProps> = ({ onAddToast }) => {
  const { getHackathons, getInternships, getDeadlines, getWins, addWin, deleteWin } = useStorage()
  const [filter, setFilter] = useState<FilterType>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [newWinTitle, setNewWinTitle] = useState('')
  const [newWinNote, setNewWinNote] = useState('')
  const [showAddWin, setShowAddWin] = useState(false)

  const completedHacks = useMemo(() => {
    return getHackathons().filter(h => h.status === 'Result')
  }, [])

  const closedInternships = useMemo(() => {
    return getInternships().filter(i => i.stage === 'Offer' || i.stage === 'Rejected')
  }, [])

  const completedDeadlines = useMemo(() => {
    return getDeadlines().filter(d => d.completed)
  }, [])

  const wins = useMemo(() => {
    return getWins()
  }, [])

  const allItems = useMemo(() => {
    const items: any[] = [
      ...completedHacks.map(h => ({ ...h, type: 'hackathon', title: h.name, date: h.createdAt })),
      ...closedInternships.map(i => ({ ...i, type: 'internship', title: `${i.company} - ${i.role}`, date: i.createdAt })),
      ...completedDeadlines.map(d => ({ ...d, type: 'deadline', title: d.title, date: d.createdAt })),
    ]

    return items
      .filter(item => {
        if (filter === 'All') return true
        if (filter === 'Hacks') return item.type === 'hackathon'
        if (filter === 'Internships') return item.type === 'internship'
        if (filter === 'Deadlines') return item.type === 'deadline'
        return true
      })
      .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [filter, searchTerm, completedHacks, closedInternships, completedDeadlines])

  const handleAddWin = () => {
    if (!newWinTitle.trim()) return

    addWin({
      id: Math.random().toString(36).substr(2, 9),
      title: newWinTitle,
      date: new Date().toISOString(),
      note: newWinNote,
    })

    setNewWinTitle('')
    setNewWinNote('')
    setShowAddWin(false)
    onAddToast('🏆 Win added to The Wall!', 'success')
  }

  const handleDeleteWin = (id: string) => {
    deleteWin(id)
    onAddToast('Win removed', 'success')
  }

  const stats = {
    totalHacks: completedHacks.length,
    totalInternships: closedInternships.length,
    totalDeadlines: completedDeadlines.length,
    totalWins: wins.length,
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Archive</h1>
        <p className="text-gray-600 mt-1">Your completed journey & wins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
          <p className="text-2xl font-bold text-blue-600">{stats.totalHacks}</p>
          <p className="text-sm text-gray-600">Completed Hacks</p>
        </div>
        <div className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-200">
          <p className="text-2xl font-bold text-purple-600">{stats.totalInternships}</p>
          <p className="text-sm text-gray-600">Closed Apps</p>
        </div>
        <div className="bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
          <p className="text-2xl font-bold text-orange-600">{stats.totalDeadlines}</p>
          <p className="text-sm text-gray-600">Done Deadlines</p>
        </div>
        <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
          <p className="text-2xl font-bold text-green-600">{stats.totalWins}</p>
          <p className="text-sm text-gray-600">🏆 Wins</p>
        </div>
      </div>

      {/* The Wall Section */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 border-2 border-orange-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-2">
            <Trophy size={28} /> The Wall
          </h2>
          <button
            onClick={() => setShowAddWin(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            + Add Win
          </button>
        </div>

        {showAddWin && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-orange-300">
            <input
              type="text"
              placeholder="E.g., Got offer from Google"
              value={newWinTitle}
              onChange={(e) => setNewWinTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 font-semibold"
            />
            <textarea
              placeholder="Add a note about this win..."
              value={newWinNote}
              onChange={(e) => setNewWinNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 resize-none h-16"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddWin}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Save Win
              </button>
              <button
                onClick={() => setShowAddWin(false)}
                className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {wins.length === 0 ? (
          <p className="text-orange-900 text-center py-8">No wins yet. Keep grinding! 🚀</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wins.map(win => (
              <div key={win.id} className="bg-white rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                <p className="font-bold text-gray-800">{win.title}</p>
                <p className="text-sm text-gray-600 mt-1">{win.date ? new Date(win.date).toLocaleDateString() : ''}</p>
                {win.note && <p className="text-sm text-gray-700 mt-2">{win.note}</p>}
                <button
                  onClick={() => handleDeleteWin(win.id)}
                  className="mt-3 text-red-600 hover:text-red-800 transition text-sm font-medium"
                >
                  Remove from wall
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Items */}
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['All', 'Hacks', 'Internships', 'Deadlines'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search archived items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allItems.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>No items found</p>
            </div>
          ) : (
            allItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'hackathon' && '🚀 Hackathon'}
                      {item.type === 'internship' && '💼 Internship'}
                      {item.type === 'deadline' && '⏰ Deadline'}
                    </p>
                    {item.type === 'internship' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Status: <span className="font-semibold">{item.stage}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
