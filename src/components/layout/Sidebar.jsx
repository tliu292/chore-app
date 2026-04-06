import { CalendarDays, ClipboardList, Users } from 'lucide-react'

const NAV = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'chores', label: 'Chores', icon: ClipboardList },
  { id: 'members', label: 'Team', icon: Users },
]

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="w-56 bg-gray-900 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <ClipboardList size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">ChoreBoard</p>
            <p className="text-gray-400 text-xs">Office Chores</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === id
                ? 'bg-indigo-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-700/50">
        <p className="text-gray-500 text-xs">Office Chore Manager</p>
      </div>
    </aside>
  )
}
