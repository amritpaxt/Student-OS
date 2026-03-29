import React from 'react'
import { LayoutGrid, Activity, Zap, Briefcase, Clock, Archive, Settings, HelpCircle, Users, ChevronDown, Tag, Zap as Focus, Coffee, Calendar, BarChart3, Package } from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  id: string
  badge?: string
}

interface NavSection {
  items: NavItem[]
  divider?: boolean
}

interface SidebarProps {
  currentPage: string
  onPageChange: (page: any) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const mainNavItems: NavItem[] = [
    { icon: <LayoutGrid size={18} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <Zap size={18} />, label: 'Task Management', id: 'hackathons', badge: '>' },
    { icon: <Activity size={18} />, label: 'Activity Feed', id: 'activityfeed' },
    { icon: <Tag size={18} />, label: 'Project Tags', id: 'deadlines' },
    { icon: <Focus size={18} />, label: 'Focus Mode', id: 'dashboard' },
    { icon: <Coffee size={18} />, label: 'Break Timer', id: 'dashboard' },
    { icon: <Calendar size={18} />, label: 'Calendar', id: 'dashboard' },
    { icon: <BarChart3 size={18} />, label: 'Reports & Analytics', id: 'reportsanalytics' },
  ]

  const settingsNavItems: NavItem[] = [
    { icon: <Package size={18} />, label: 'Workspace Settings', id: 'workspacesettings' },
    { icon: <Settings size={18} />, label: 'Setup Guide', id: 'setupguide' },
  ]

  const supportNavItems: NavItem[] = [
    { icon: <HelpCircle size={18} />, label: 'AI Help', id: 'aihelp' },
    { icon: <Users size={18} />, label: 'Contact Support', id: 'contactsupport' },
  ]

  return (
    <div className="hidden md:flex flex-col w-72 bg-gradient-to-b from-pink-950 via-purple-950 to-blue-950 h-screen fixed left-0 top-0 overflow-y-auto text-white">
      {/* Header */}
      <div className="p-6 border-b border-pink-800/30">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">StudentOS</span>
        </div>
        
        {/* Workspace Selector */}
        <div className="flex items-center justify-between bg-white/10 hover:bg-white/15 px-3 py-2.5 rounded-lg transition cursor-pointer backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded flex items-center justify-center text-xs font-bold text-white">P</div>
            <div className="text-sm">
              <p className="font-semibold text-white leading-tight">Panze Workspace</p>
            </div>
          </div>
          <ChevronDown size={16} className="text-pink-300/50" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium group ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-pink-100/70 hover:bg-white/10 hover:text-pink-100'
            }`}
          >
            <span className={`${currentPage === item.id ? 'text-white' : 'text-pink-300/50 group-hover:text-pink-200/70'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && <span className="text-xs text-pink-300/50">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-pink-800/30 p-4 space-y-1">
        {settingsNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium group ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-pink-100/70 hover:bg-white/10 hover:text-pink-100'
            }`}
          >
            <span className={`${currentPage === item.id ? 'text-white' : 'text-pink-300/50 group-hover:text-pink-200/70'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Support Section */}
      <div className="border-t border-pink-800/30 p-4 space-y-1 mb-4">
        {supportNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium group ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-pink-100/70 hover:bg-white/10 hover:text-pink-100'
            }`}
          >
            <span className={`${currentPage === item.id ? 'text-white' : 'text-pink-300/50 group-hover:text-pink-200/70'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}


