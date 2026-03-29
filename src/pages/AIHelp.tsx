import React, { useState } from 'react'
import { Send, Loader, Brain, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react'

interface AIHelpProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const AIHelp: React.FC<AIHelpProps> = ({ onAddToast }) => {
  const [messages, setMessages] = useState<Array<{ id: string; type: 'user' | 'ai'; content: string }>>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your StudentOS AI Assistant. I can help you with hackathon strategies, internship preparation, deadline management, and productivity tips. What would you like help with?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    'How to ace hackathon interviews?',
    'What skills should I learn for internships?',
    'How to manage multiple deadlines?',
    'Tips for productivity and staying focused'
  ]

  const handleSendMessage = (question?: string) => {
    const text = question || inputValue.trim()
    if (!text) return

    // Add user message
    const userMsg = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user' as const,
      content: text
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response with delay
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        'How to ace hackathon interviews?': 'Great question! Here are key tips:\n\n1. **Practice coding problems** - Focus on DSA, system design, and problem-solving\n2. **Showcase your projects** - Highlight your hackathon and portfolio projects\n3. **Communication** - Explain your thought process clearly\n4. **Mock interviews** - Practice with peers and mentors\n5. **Research the company** - Understand their products and tech stack\n\nWould you like specific resources or tips on any of these?',
        'What skills should I learn for internships?': 'Essential skills for internships:\n\n**Technical:**\n- Core DSA (Data Structures & Algorithms)\n- System Design basics\n- Frontend: React/Vue/Angular\n- Backend: Node.js, Java, or Python\n\n**Soft Skills:**\n- Communication and collaboration\n- Problem-solving mindset\n- Adaptability\n- Time management\n\n**Building Experience:**\n- Create 2-3 strong portfolio projects\n- Contribute to open source\n- Attend hackathons\n\nWould you like a learning roadmap?',
        'How to manage multiple deadlines?': 'Effective deadline management:\n\n1. **Prioritize** - Use the Eisenhower Matrix (urgent vs important)\n2. **Break down tasks** - Divide large projects into smaller milestones\n3. **Set buffer time** - Add 20% extra time for unexpected issues\n4. **Track progress** - Use StudentOS to monitor your deadlines\n5. **Time blocking** - Allocate specific hours for each task\n6. **Avoid context switching** - Focus on one task at a time\n\nTry using Focus Mode in StudentOS for deep work sessions!',
        'Tips for productivity and staying focused': 'Pro productivity hacks:\n\n**Time Management:**\n- Pomodoro Technique (25 min work, 5 min break)\n- Time blocking by priority\n- Early morning focus sessions\n\n**Environment:**\n- Eliminate distractions (phone in another room)\n- Use website blockers (Cold Turkey, Freedom)\n- Find your peak productivity hours\n\n**Habits:**\n- Daily standup (5 min review)\n- Weekly planning (Sunday ritual)\n- Health first (sleep 7-8 hrs, exercise)\n\n**StudentOS Features:**\n- Use Break Timer for structured breaks\n- Focus Mode for deep work\n- Streak tracking for motivation\n\nStart with one habit and compound!'
      }

      const response = aiResponses[text] || `Thanks for asking! I understand you want to know about "${text}". This is an area I can help you with. For specific guidance, consider:\n\n1. Breaking down your question into specific sub-topics\n2. Sharing your current situation (Year, skills, goals)\n3. Asking for actionable steps\n\nWhat specific aspect would you like to dive deeper into?`

      const aiMsg = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai' as const,
        content: response
      }
      setMessages(prev => [...prev, aiMsg])
      setIsLoading(false)
      onAddToast('AI response generated!', 'success')
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 md:ml-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Brain size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">AI Assistant</h1>
          </div>
          <p className="text-pink-100">Get personalized guidance on hackathons, internships, and productivity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-200px)] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-auto mb-6 space-y-4 bg-white rounded-2xl p-6 shadow-lg">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg px-6 py-4 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gradient-to-br from-purple-100 to-blue-100 text-gray-900 border border-purple-200'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 px-6 py-4 rounded-2xl border border-purple-200">
                <Loader size={24} className="animate-spin text-purple-600" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="text-left p-3 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700 group-hover:text-purple-600">{q}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about hackathons, internships, productivity..."
            className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none text-sm md:text-base"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition self-end"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
