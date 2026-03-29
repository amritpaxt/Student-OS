import React, { useState, useMemo } from 'react'
import { Trash2, Play, CheckCircle } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import { useCountdown, formatCountdown, getCountdownColor } from '../hooks/useCountdown'
import type { Deadline } from '../types'

interface DeadlinesProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const Deadlines: React.FC<DeadlinesProps> = ({ onAddToast }) => {
  const { getDeadlines, updateDeadline, deleteDeadline } = useStorage()
  const [deadlines, setDeadlines] = useState<Deadline[]>(getDeadlines())
  const [focusSprintTarget, setFocusSprintTarget] = useState<string | null>(null)

  const activeDeadlines = useMemo(() => {
    return deadlines
      .filter(d => !d.completed)
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
  }, [deadlines])

  const totalBurnMeterHours = useMemo(() => {
    return activeDeadlines.reduce((sum, d) => sum + d.estimatedHours, 0)
  }, [activeDeadlines])

  const burnMeterColor =
    totalBurnMeterHours > 40 ? 'bg-red-500' : totalBurnMeterHours > 20 ? 'bg-amber-500' : 'bg-green-500'

  const handleDelete = (id: string) => {
    deleteDeadline(id)
    setDeadlines(getDeadlines())
    onAddToast('Deadline deleted', 'success')
  }

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateDeadline(id, { completed: !completed })
    setDeadlines(getDeadlines())
    onAddToast(completed ? 'Deadline uncompleted' : '✅ Deadline completed!', 'success')
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Deadlines</h1>
        <p className="text-gray-600 mt-1">Track all your urgent items</p>
      </div>

      {/* Burn Meter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800">Burn Meter</h3>
          <span className="font-bold text-lg">
            {totalBurnMeterHours}h <span className="text-sm text-gray-600">estimated</span>
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${burnMeterColor} transition-all`}
              style={{ width: `${Math.min((totalBurnMeterHours / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Deadlines Timeline */}
      <div className="space-y-3">
        {activeDeadlines.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No active deadlines. You're all set! 🎉</p>
          </div>
        ) : (
          activeDeadlines.map((deadline, idx) => (
            <DeadlineTimelineItem
              key={deadline.id}
              deadline={deadline}
              isFirst={idx === 0}
              isLast={idx === activeDeadlines.length - 1}
              onDelete={() => handleDelete(deadline.id)}
              onToggleComplete={() => handleToggleComplete(deadline.id, deadline.completed)}
              onFocusSprint={() => {
                setFocusSprintTarget(deadline.id)
                onAddToast(`Focus Sprint started for "${deadline.title}"`, 'success')
              }}
            />
          ))
        )}
      </div>

      {/* Modal for completed deadlines */}
      {deadlines.some(d => d.completed) && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">✅ Completed Deadlines</h2>
          <div className="space-y-2">
            {deadlines
              .filter(d => d.completed)
              .map(deadline => (
                <div key={deadline.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div className="line-through text-gray-500">
                    <p className="font-semibold">{deadline.title}</p>
                    <p className="text-xs">{deadline.type}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(deadline.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

const DeadlineTimelineItem: React.FC<{
  deadline: Deadline
  isFirst: boolean
  isLast: boolean
  onDelete: () => void
  onToggleComplete: () => void
  onFocusSprint: () => void
}> = ({ deadline, isFirst, isLast, onDelete, onToggleComplete, onFocusSprint }) => {
  const countdown = useCountdown(deadline.dueAt)

  const typeIcons: Record<string, string> = {
    Exam: '📝',
    Submission: '📤',
    Interview: '💼',
    Meeting: '👥',
  }

  const timeUntil = deadline.type
  const now = new Date().getTime()
  const dueTime = new Date(deadline.dueAt).getTime()
  const hoursLeft = Math.ceil((dueTime - now) / (1000 * 60 * 60))
  const isUrgent = hoursLeft < 24

  return (
    <div className={`relative pl-8 pb-8 ${!isLast ? 'pb-8' : ''}`}>
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-300" />
      )}

      {/* Timeline dot */}
      <div className={`absolute -left-2 top-2 w-6 h-6 rounded-full border-4 border-white ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`} />

      {/* Card */}
      <div
        className={`rounded-lg p-4 border-l-4 ${
          isUrgent
            ? 'bg-red-50 border-red-500'
            : hoursLeft < 72
              ? 'bg-amber-50 border-amber-500'
              : 'bg-blue-50 border-blue-500'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{typeIcons[deadline.type] || '📌'}</span>
              <h3 className="font-bold text-gray-800">{deadline.title}</h3>
              <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                {deadline.type}
              </span>
            </div>
            <p className="text-sm text-gray-600">⏱️ {deadline.estimatedHours}h estimated</p>
          </div>

          {/* Countdown Badge */}
          <div
            className={`text-center font-bold text-sm px-3 py-2 rounded ${
              isUrgent
                ? 'bg-red-200 text-red-800'
                : hoursLeft < 72
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-blue-200 text-blue-800'
            }`}
          >
            {isUrgent ? (
              <div>
                <p>{countdown.hours}h {countdown.minutes}m</p>
              </div>
            ) : (
              <div>
                <p>{countdown.days}d {countdown.hours}h</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onFocusSprint}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Play size={16} /> Focus Sprint
          </button>
          <button
            onClick={onToggleComplete}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <CheckCircle size={18} />
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
