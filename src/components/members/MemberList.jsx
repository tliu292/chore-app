import { useState } from 'react'
import { Plus, Pencil, Trash2, UserCircle2 } from 'lucide-react'
import MemberForm from './MemberForm'
import ConfirmDialog from '../shared/ConfirmDialog'
import { getNextColor } from '../../utils/colors'

export default function MemberList({ members, chores, onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [deletingMember, setDeletingMember] = useState(null)

  function getChoreCount(memberId) {
    return chores.filter(c => c.assigneeId === memberId).length
  }

  function handleSave(data) {
    if (editingMember) {
      onUpdate(editingMember.id, data)
    } else {
      onAdd({ ...data, color: data.color || getNextColor(members) })
    }
    setShowForm(false)
    setEditingMember(null)
  }

  function handleDelete() {
    onRemove(deletingMember.id)
    setDeletingMember(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16">
          <UserCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No team members yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your first team member to start assigning chores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => {
            const choreCount = getChoreCount(member.id)
            return (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {choreCount} chore{choreCount !== 1 ? 's' : ''} assigned
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingMember(member); setShowForm(true) }}
                    className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingMember(member)}
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

      {(showForm || editingMember) && (
        <MemberForm
          member={editingMember}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingMember(null) }}
        />
      )}

      {deletingMember && (
        <ConfirmDialog
          title="Remove Member"
          message={`Remove ${deletingMember.name}? They will be unassigned from all chores.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingMember(null)}
        />
      )}
    </div>
  )
}
