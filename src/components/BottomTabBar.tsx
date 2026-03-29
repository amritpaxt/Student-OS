import React from 'react'
import { LayoutGrid, Zap, Briefcase, Clock, Archive, Activity } from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  id: string
}

interface BottomTabBarProps {
  currentPage: string
  onPageChange: (page: any) => void
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentPage, onPageChange }) => {
  const navItems: NavItem[] = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <Activity size={20} />, label: 'Activity', id: 'activityfeed' },
    { icon: <Zap size={20} />, label: 'Hacks', id: 'hackathons' },
    { icon: <Briefcase size={20} />, label: 'Interns', id: 'internships' },
    { icon: <Clock size={20} />, label: 'Deadlines', id: 'deadlines' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-lg overflow-x-auto">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-2 flex-1 transition-all duration-200 whitespace-nowrap ${
            currentPage === item.id
              ? 'text-blue-600 border-t-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title={item.label}
        >
          {item.icon}
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
