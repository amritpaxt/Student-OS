import React from 'react'
import { Plus } from 'lucide-react'

interface FloatingAddButtonProps {
  onClick: () => void
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed md:bottom-8 md:right-8 bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center text-white z-40"
      title="Quick Add"
    >
      <Plus size={28} strokeWidth={3} />
    </button>
  )
}
