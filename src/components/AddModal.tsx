import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useStorage } from '../hooks/useStorage'

interface AddModalProps {
  onClose: () => void
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

type ItemType = 'hackathon' | 'internship' | 'deadline'

export const AddModal: React.FC<AddModalProps> = ({ onClose, onAddToast }) => {
  const [itemType, setItemType] = useState<ItemType>('hackathon')
  const [formData, setFormData] = useState<any>({})
  const { addHackathon, addInternship, addDeadline, addActivity } = useStorage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // For date inputs (YYYY-MM-DD format), convert to ISO 8601 with UTC time
    let finalValue = value
    if ((name === 'deadline' || name === 'dueAt') && value) {
      // Directly convert date string to ISO format (YYYY-MM-DD → YYYY-MM-DDTHH:mm:ss.sssZ)
      finalValue = value + 'T00:00:00.000Z'
    }
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()

    switch (itemType) {
      case 'hackathon':
        addHackathon({
          id,
          name: formData.name || 'Untitled Hackathon',
          status: 'Discover',
          deadline: formData.deadline || new Date().toISOString(),
          team: [],
          stack: [],
          hoursLogged: 0,
          createdAt: now,
        })
        // Create activity entry
        addActivity({
          id: Math.random().toString(36).substr(2, 9),
          profileId: '',
          platform: 'studentos',
          type: 'hackathon_added',
          title: `Added hackathon: ${formData.name || 'Untitled'}`,
          description: `New hackathon added to your tracker`,
          timestamp: now,
          metadata: { itemId: id },
        })
        onAddToast('🚀 Hackathon added!', 'success')
        break
      case 'internship':
        addInternship({
          id,
          company: formData.company || 'Unknown Company',
          role: formData.role || 'Unknown Role',
          stipend: formData.stipend || '',
          stage: 'Applied',
          rounds: [],
          confidenceScores: { dsa: 5, systemDesign: 5, behavioural: 5 },
          hoursLogged: 0,
          createdAt: now,
        })
        // Create activity entry
        addActivity({
          id: Math.random().toString(36).substr(2, 9),
          profileId: '',
          platform: 'studentos',
          type: 'internship_added',
          title: `Applied to: ${formData.company || 'Unknown'}`,
          description: `New internship added - ${formData.role || 'Unknown Role'}`,
          timestamp: now,
          metadata: { itemId: id },
        })
        onAddToast('💼 Internship added!', 'success')
        break
      case 'deadline':
        addDeadline({
          id,
          title: formData.title || 'Untitled Deadline',
          type: formData.type || 'Submission',
          dueAt: formData.dueAt || new Date().toISOString(),
          estimatedHours: parseInt(formData.estimatedHours) || 2,
          completed: false,
          hoursLogged: 0,
          createdAt: now,
        })
        // Create activity entry
        addActivity({
          id: Math.random().toString(36).substr(2, 9),
          profileId: '',
          platform: 'studentos',
          type: 'deadline_added',
          title: `New deadline: ${formData.title || 'Untitled'}`,
          description: `Deadline added - ${formData.type || 'Submission'}`,
          timestamp: now,
          metadata: { itemId: id },
        })
        onAddToast('⏰ Deadline added!', 'success')
        break
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Quick Add</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Type Selector */}
          <div className="mb-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">What are you adding?</label>
            <select
              value={itemType}
              onChange={(e) => {
                setItemType(e.target.value as ItemType)
                setFormData({})
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium"
            >
              <option value="hackathon">🚀 Hackathon</option>
              <option value="internship">💼 Internship</option>
              <option value="deadline">⏰ Deadline</option>
            </select>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {itemType === 'hackathon' && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Hackathon name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </>
            )}

            {itemType === 'internship' && (
              <>
                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  value={formData.company || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={formData.role || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="stipend"
                  placeholder="Stipend (optional)"
                  value={formData.stipend || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {itemType === 'deadline' && (
              <>
                <input
                  type="text"
                  name="title"
                  placeholder="Deadline title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  name="type"
                  value={formData.type || 'Submission'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Exam">Exam</option>
                  <option value="Submission">Submission</option>
                  <option value="Interview">Interview</option>
                  <option value="Meeting">Meeting</option>
                </select>
                <input
                  type="date"
                  name="dueAt"
                  value={formData.dueAt ? new Date(formData.dueAt).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="number"
                  name="estimatedHours"
                  placeholder="Estimated hours"
                  value={formData.estimatedHours || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </>
            )}

            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Add {itemType}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
