import React, { useState } from 'react'
import { BookOpen, CheckCircle, AlertCircle, ArrowRight, Zap } from 'lucide-react'

interface SetupGuideProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ onAddToast }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      id: 1,
      title: 'Complete Your Profile',
      description: 'Set up your StudentOS profile with your name, profile picture, and academic year.',
      details: [
        'Go to Settings > Profile',
        'Add a profile picture',
        'Enter your current year/semester',
        'Add your college name'
      ],
      time: '5 min',
      icon: '👤'
    },
    {
      id: 2,
      title: 'Link Your Profiles',
      description: 'Connect your Unstop and Internshala accounts to track applications automatically.',
      details: [
        'Go to Activity Feed > Link Profile',
        'Choose Unstop or Internshala',
        'Paste your profile URL',
        'Verify the connection'
      ],
      time: '3 min',
      icon: '🔗'
    },
    {
      id: 3,
      title: 'Add Your First Items',
      description: 'Start tracking hackathons, internships, and deadlines you\'re interested in.',
      details: [
        'Click the + button to add items',
        'Add 3-5 hackathons you plan to attend',
        'Add internship applications you\'ve submitted',
        'Add project deadlines to track'
      ],
      time: '10 min',
      icon: '➕'
    },
    {
      id: 4,
      title: 'Customize Your Settings',
      description: 'Configure your productivity mode, themes, and notification preferences.',
      details: [
        'Choose your mode: Hustle, Grind, or Chill',
        'Set your productivity goals',
        'Enable notifications if desired',
        'Configure your workspace name'
      ],
      time: '5 min',
      icon: '⚙️'
    },
    {
      id: 5,
      title: 'Explore Focus Mode',
      description: 'Use Focus Mode to concentrate on deep work without distractions.',
      details: [
        'Select a task or deadline',
        'Click Focus Sprint (25 minutes)',
        'Use Break Timer during breaks',
        'Log your hours worked'
      ],
      time: '15 min',
      icon: '🎯'
    },
    {
      id: 6,
      title: 'Check Your Dashboard',
      description: 'Review your activity pulse, streak, and recent achievements.',
      details: [
        'View your daily streak',
        'Check upcoming deadlines',
        'Review activity heatmap',
        'Track your productivity metrics'
      ],
      time: '5 min',
      icon: '📊'
    }
  ]

  const toggleStep = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(s => s !== id))
    } else {
      setCompletedSteps([...completedSteps, id])
      onAddToast('Great! Step completed!', 'success')
    }
  }

  const progress = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 md:ml-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Setup Guide</h1>
          </div>
          <p className="text-pink-100">Get started with StudentOS in 6 simple steps</p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
            <span className="text-2xl font-bold text-purple-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {completedSteps.length} of {steps.length} steps completed
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition cursor-pointer group hover:shadow-xl ${
                completedSteps.includes(step.id)
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                  : 'border-purple-200 hover:border-purple-400'
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStep(step.id)
                    }}
                    className="flex-shrink-0"
                  >
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle size={28} className="text-green-500" />
                    ) : (
                      <div className="w-7 h-7 rounded-full border-3 border-purple-300 flex items-center justify-center text-purple-600 font-bold text-sm">
                        {step.id}
                      </div>
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>

                    {completedSteps.includes(step.id) && (
                      <div className="space-y-2 mb-4">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <ArrowRight size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-purple-600 font-semibold">
                        <Zap size={16} />
                        <span>{step.time}</span>
                      </div>
                      {completedSteps.includes(step.id) && (
                        <span className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8 mt-8">
          <div className="flex gap-3">
            <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Pro Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Complete all setup steps to unlock all features</li>
                <li>✓ Sync with Unstop/Internshala for automatic updates</li>
                <li>✓ Use Focus Mode to boost your productivity</li>
                <li>✓ Check your daily streak to stay motivated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
