import React, { useState } from 'react'
import { Mail, Phone, MessageSquare, Send, MapPin, Clock } from 'lucide-react'

interface ContactSupportProps {
  onAddToast: (message: string, type: 'success' | 'warning' | 'error') => void
}

export const ContactSupport: React.FC<ContactSupportProps> = ({ onAddToast }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'faq' | 'contact'>('form')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const faqs = [
    {
      q: 'How do I reset my password?',
      a: 'Click on Settings > Account Security > Reset Password. A verification email will be sent to your registered email address.'
    },
    {
      q: 'Can I export my data?',
      a: 'Yes! Go to Settings > Data Management > Export. You can download your data in CSV or JSON format.'
    },
    {
      q: 'Is my data secure?',
      a: 'All your data is stored locally in your browser using localStorage. StudentOS never stores personal data on external servers.'
    },
    {
      q: 'How do I delete my account?',
      a: 'Visit Settings > Account > Delete Account. This will permanently remove all your data from your browser.'
    },
    {
      q: 'Can I sync across devices?',
      a: 'Currently, StudentOS uses local browser storage. Official cloud sync is coming in v2.0!'
    },
    {
      q: 'How do I report a bug?',
      a: 'Use the Contact Support form to describe the issue. Include your browser, version, and steps to reproduce.'
    }
  ]

  const contactChannels = [
    {
      icon: <Mail size={24} />,
      title: 'Email',
      description: 'support@studentos.dev',
      details: 'Response time: 24-48 hours'
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Discord',
      description: 'discord.gg/studentos',
      details: 'Active community, real-time chat'
    },
    {
      icon: <Phone size={24} />,
      title: 'Schedule Call',
      description: 'Book a 1:1 session',
      details: 'Available Mon-Fri, 10 AM - 6 PM IST'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      onAddToast('Please fill in all fields', 'warning')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onAddToast('Support ticket submitted! We\'ll contact you soon.', 'success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 md:ml-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Contact Support</h1>
          </div>
          <p className="text-pink-100">We're here to help! Reach out with questions or feedback</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex gap-4 mb-8 border-b-2 border-purple-200">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'form'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Send Message
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'faq'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'contact'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Contact Info
          </button>
        </div>

        {/* Form Tab */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more..."
                  rows={6}
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {isSubmitting ? 'Submitting...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-lg border-2 border-purple-200 p-6 hover:border-purple-400 transition cursor-pointer group"
              >
                <summary className="font-semibold text-gray-900 flex gap-3 items-start">
                  <span className="text-purple-500 font-bold mt-1">Q:</span>
                  <span className="flex-1">{faq.q}</span>
                </summary>
                <p className="mt-4 text-gray-700 ml-8">
                  <span className="text-purple-500 font-bold">A: </span>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        )}

        {/* Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactChannels.map((channel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-purple-300 transition"
              >
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 mb-4">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
                <p className="text-purple-600 font-semibold mb-2">{channel.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{channel.details}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
