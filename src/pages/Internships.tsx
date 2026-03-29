import React, { useState } from 'react'
import { Trash2, ChevronRight } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'
import type { Internship } from '../types'

interface InternshipsProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

type Stage = 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected'

export const Internships: React.FC<InternshipsProps> = ({ onAddToast }) => {
  const { getInternships, updateInternship, deleteInternship } = useStorage()
  const [internships, setInternships] = useState<Internship[]>(getInternships())
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const stages: Stage[] = ['Applied', 'OA', 'Interview', 'Offer']

  const getInternshipsByStage = (stage: Stage) => {
    return internships.filter(i => i.stage === stage)
  }

  const handleMoveStage = (id: string, newStage: Stage) => {
    updateInternship(id, { stage: newStage })
    setInternships(getInternships())
    onAddToast(`Moved to ${newStage}`, 'success')
  }

  const handleDelete = (id: string) => {
    deleteInternship(id)
    setInternships(getInternships())
    onAddToast('Internship deleted', 'success')
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Internships</h1>
        <p className="text-gray-600 mt-1">Kanban board of your applications</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => (
          <div key={stage} className="bg-gray-50 rounded-lg p-4 min-h-96">
            <h2 className="font-bold text-gray-800 mb-4">
              {stage}
              <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                {getInternshipsByStage(stage).length}
              </span>
            </h2>

            <div className="space-y-3">
              {getInternshipsByStage(stage).map(internship => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onSelect={() => setSelectedInternship(internship)}
                  onDelete={() => handleDelete(internship.id)}
                  onMoveNext={() => {
                    const stageIndex = stages.indexOf(stage)
                    if (stageIndex < stages.length - 1) {
                      handleMoveStage(internship.id, stages[stageIndex + 1])
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedInternship && (
        <InternshipDetailDrawer
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onUpdate={(updates) => {
            updateInternship(selectedInternship.id, updates)
            setInternships(getInternships())
            setSelectedInternship({ ...selectedInternship, ...updates })
          }}
        />
      )}
    </div>
  )
}

const InternshipCard: React.FC<{
  internship: Internship
  onSelect: () => void
  onDelete: () => void
  onMoveNext: () => void
}> = ({ internship, onSelect, onDelete, onMoveNext }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={onSelect}>
      <h3 className="font-bold text-gray-800 text-sm">{internship.company}</h3>
      <p className="text-xs text-gray-600">{internship.role}</p>
      {internship.stipend && <p className="text-xs font-semibold text-green-600 mt-1">₹ {internship.stipend}/month</p>}

      <div className="flex gap-1 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMoveNext()
          }}
          className="flex-1 bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600 transition flex items-center justify-center gap-1"
        >
          Move <ChevronRight size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="px-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

const InternshipDetailDrawer: React.FC<{
  internship: Internship
  onClose: () => void
  onUpdate: (updates: Partial<Internship>) => void
}> = ({ internship, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'war-room' | 'radar'>('info')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-end md:justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-96 md:h-auto overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-2xl md:rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">{internship.company}</h2>
            <p className="text-gray-600">{internship.role}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b px-4 pt-4">
          {['info', 'war-room', 'radar'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 font-semibold transition border-b-2 ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
              }`}
            >
              {tab === 'info' && 'Info'}
              {tab === 'war-room' && 'Interview War Room'}
              {tab === 'radar' && 'Smart Apply Radar'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stipend</label>
                <input
                  type="text"
                  value={internship.stipend}
                  onChange={(e) => onUpdate({ stipend: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 75,000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Follow-up Reminder</label>
                <input
                  type="text"
                  value={internship.followUp || ''}
                  onChange={(e) => onUpdate({ followUp: e.target.value })}
                  placeholder="e.g., Follow up on Monday"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeTab === 'war-room' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Interview Rounds</label>
                <div className="space-y-2">
                  {internship.rounds.map(round => (
                    <div key={round.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold text-sm capitalize">{round.type}</p>
                      {round.outcome && <p className="text-xs text-gray-600 mt-1">Outcome: {round.outcome}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Confidence Scores</label>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">DSA: {internship.confidenceScores.dsa}/10</p>
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${(internship.confidenceScores.dsa / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">System Design: {internship.confidenceScores.systemDesign}/10</p>
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${(internship.confidenceScores.systemDesign / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Behavioural: {internship.confidenceScores.behavioural}/10</p>
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${(internship.confidenceScores.behavioural / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'radar' && (
            <div className="space-y-4">
              <textarea
                placeholder="Paste job description here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
              />
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                🚀 Analyse JD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
