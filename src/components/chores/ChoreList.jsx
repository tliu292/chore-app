import { useState } from 'react'
import { Plus, Pencil, Trash2, ClipboardList, RepeatIcon, CalendarDays } from 'lucide-react'
import ChoreForm from './ChoreForm'
import ConfirmDialog from '../shared/ConfirmDialog'

const FREQ_LABELS = {
  once: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function recurrenceLabel(rec) {
  if (!rec) return ''
  if (rec.type === 'once') return `On ${rec.startDate}`
  if (rec.type === 'daily') return 'Every day'
  if (rec.type === 'weekly') {
    const days = (rec.daysOfWeek || []).sort().map(d => DAYS[d]).join(', ')
    return `Every ${days}`
  }
  if (rec.type === 'monthly') return `Monthly on day ${rec.dayOfMonth}`
  return ''
}

export default function ChoreList({ chores, members, onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false)
  const [editingChore, setEditingChore] = useState(null)
  const [deletingChore, setDeletingChore] = useState(null)

  function getMember(id) {
    return members.find(m => m.id === id)
  }

  function handleSave(data) {
    if (editingChore) {
      onUpdate(editingChore.id, data)
    } else {
      onAdd(data)
    }
    setShowForm(false)
    setEditingChore(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{chores.length} chore{chores.length !== 1 ? 's' : ''} defined</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} />
          Add Chore
        </button>
      </div>

      {chores.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No chores yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your first chore to get the office organized.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chores.map(chore => {
            const member = getMember(chore.assigneeId)
            return (
              <div
                key={chore.id}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex items-center gap-4 hover:shadow-sm transition-shadow group"
              >
                {/* Color bar */}
                <div
                  className="w-1 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: member?.color || '#e5e7eb' }}
                />

                {/* Chore info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{chore.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <RepeatIcon size={11} />
                      {FREQ_LABELS[chore.recurrence?.type] || '—'}
                    </span>
                    <span className="text-xs text-gray-400">{recurrenceLabel(chore.recurrence)}</span>
                  </div>
                </div>

                {/* Assignee */}
                {member ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initial}
                    </div>
                    <span className="text-sm text-gray-600 hidden sm:block">{member.name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 flex-shrink-0">Unassigned</span>
                )}

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={() => { setEditingChore(chore); setShowForm(true) }}
                    className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingChore(chore)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(showForm || editingChore) && (
        <ChoreForm
          chore={editingChore}
          members={members}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingChore(null) }}
        />
      )}

      {deletingChore && (
        <ConfirmDialog
          title="Delete Chore"
          message={`Delete "${deletingChore.title}"? This cannot be undone.`}
          onConfirm={() => { onRemove(deletingChore.id); setDeletingChore(null) }}
          onCancel={() => setDeletingChore(null)}
        />
      )}
    </div>
  )
}
