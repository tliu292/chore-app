import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import CalendarView from './components/calendar/CalendarView'
import ChoreList from './components/chores/ChoreList'
import MemberList from './components/members/MemberList'
import { useChores } from './hooks/useChores'
import { useMembers } from './hooks/useMembers'

export default function App() {
  const [activeView, setActiveView] = useState('calendar')
  const { chores, addChore, updateChore, removeChore, unassignMember } = useChores()
  const { members, addMember, updateMember, removeMember } = useMembers()

  function handleRemoveMember(id) {
    unassignMember(id)
    removeMember(id)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 ml-56 min-h-screen">
        {activeView === 'calendar' && (
          <div className="h-screen flex flex-col">
            <CalendarView
              chores={chores}
              members={members}
              onUpdateChore={updateChore}
              onAddChore={addChore}
            />
          </div>
        )}
        {activeView === 'chores' && (
          <ChoreList
            chores={chores}
            members={members}
            onAdd={addChore}
            onUpdate={updateChore}
            onRemove={removeChore}
          />
        )}
        {activeView === 'members' && (
          <MemberList
            members={members}
            chores={chores}
            onAdd={addMember}
            onUpdate={updateMember}
            onRemove={handleRemoveMember}
          />
        )}
      </main>
    </div>
  )
}
