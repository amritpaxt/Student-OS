import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { BottomTabBar } from './components/BottomTabBar'
import { FloatingAddButton } from './components/FloatingAddButton'
import { Dashboard } from './pages/Dashboard'
import { ActivityFeed } from './pages/ActivityFeed'
import { Hackathons } from './pages/Hackathons'
import { Internships } from './pages/Internships'
import { Deadlines } from './pages/Deadlines'
import { Archive } from './pages/Archive'
import { AIHelp } from './pages/AIHelp'
import { ContactSupport } from './pages/ContactSupport'
import { SetupGuide } from './pages/SetupGuide'
import { WorkspaceSettings } from './pages/WorkspaceSettings'
import { ReportsAnalytics } from './pages/ReportsAnalytics'
import { AddModal } from './components/AddModal'
import { ToastNotification } from './components/ToastNotification'
import { useStorage } from './hooks/useStorage'
import type { AppMode } from './types'

type Page = 'dashboard' | 'activityfeed' | 'hackathons' | 'internships' | 'deadlines' | 'archive' | 'aihelp' | 'contactsupport' | 'setupguide' | 'workspacesettings' | 'reportsanalytics'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [showAddModal, setShowAddModal] = useState(false)
  const [mode, setMode] = useState<AppMode>('grind')
  const [streak, setStreak] = useState(0)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'warning' | 'error' }>>([])
  const { getSettings, updateSettings } = useStorage()

  // Initialize from localStorage
  useEffect(() => {
    const settings = getSettings()
    setMode(settings.currentMode || 'grind')
    setStreak(settings.streak || 0)
    checkDailyStreak()
  }, [])

  // Check daily streak increment
  const checkDailyStreak = () => {
    const lastLogin = localStorage.getItem('studentos_lastLogin')
    const today = new Date().toDateString()
    
    if (lastLogin !== today) {
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('studentos_lastLogin', today)
      updateSettings({ streak: newStreak, lastLogin: today })
      addToast('🔥 Streak increased!', 'success')
    }
  }

  const addToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev: Array<{ id: string; message: string; type: 'success' | 'warning' | 'error' }>) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev: Array<{ id: string; message: string; type: 'success' | 'warning' | 'error' }>) => prev.filter((t: { id: string; message: string; type: 'success' | 'warning' | 'error' }) => t.id !== id))
    }, 3000)
  }

  const changePage = (page: Page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard mode={mode} streak={streak} onModeChange={setMode} onAddToast={addToast} />
      case 'activityfeed':
        return <ActivityFeed onAddToast={addToast} />
      case 'hackathons':
        return <Hackathons onAddToast={addToast} />
      case 'internships':
        return <Internships onAddToast={addToast} />
      case 'deadlines':
        return <Deadlines onAddToast={addToast} />
      case 'archive':
        return <Archive onAddToast={addToast} />
      case 'aihelp':
        return <AIHelp onAddToast={addToast} />
      case 'contactsupport':
        return <ContactSupport onAddToast={addToast} />
      case 'setupguide':
        return <SetupGuide onAddToast={addToast} />
      case 'workspacesettings':
        return <WorkspaceSettings onAddToast={addToast} />
      case 'reportsanalytics':
        return <ReportsAnalytics onAddToast={addToast} />
      default:
        return <Dashboard mode={mode} streak={streak} onModeChange={setMode} onAddToast={addToast} />
    }
  }

  const modeStyles = {
    hustle: 'from-red-100 to-pink-100',
    grind: 'from-orange-100 to-amber-100',
    chill: 'from-cyan-100 to-blue-100',
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-white`}>
      <Sidebar currentPage={currentPage} onPageChange={changePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-72">
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>

      <BottomTabBar currentPage={currentPage} onPageChange={changePage} />
      <FloatingAddButton onClick={() => setShowAddModal(true)} />
      
      {showAddModal && (
        <AddModal onClose={() => setShowAddModal(false)} onAddToast={addToast} />
      )}

      <div className="fixed bottom-20 md:bottom-8 right-8 space-y-2 pointer-events-none">
        {toasts.map((toast: { id: string; message: string; type: 'success' | 'warning' | 'error' }) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
          />
        ))}
      </div>
    </div>
  )
}

export default App
