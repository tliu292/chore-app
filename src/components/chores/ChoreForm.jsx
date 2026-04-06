import { useState } from 'react'
import Modal from '../shared/Modal'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const RECURRENCE_TYPES = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function defaultRecurrence() {
  return {
    type: 'weekly',
    startDate: todayStr(),
    endDate: '',
    daysOfWeek: [new Date().getDay()],
    dayOfMonth: new Date().getDate(),
  }
}

export default function ChoreForm({ chore, members, onSave, onClose }) {
  const rec = chore?.recurrence || defaultRecurrence()

  const [title, setTitle] = useState(chore?.title || '')
  const [description, setDescription] = useState(chore?.description || '')
  const [assigneeId, setAssigneeId] = useState(chore?.assigneeId || '')
  const [recType, setRecType] = useState(rec.type)
  const [startDate, setStartDate] = useState(rec.startDate || todayStr())
  const [endDate, setEndDate] = useState(rec.endDate || '')
  const [daysOfWeek, setDaysOfWeek] = useState(rec.daysOfWeek || [new Date().getDay()])
  const [dayOfMonth, setDayOfMonth] = useState(rec.dayOfMonth || new Date().getDate())

  function toggleDay(day) {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    if (recType === 'weekly' && daysOfWeek.length === 0) return

    const recurrence = { type: recType, startDate, endDate: endDate || null }
    if (recType === 'weekly') recurrence.daysOfWeek = daysOfWeek
    if (recType === 'monthly') recurrence.dayOfMonth = dayOfMonth

    onSave({
      title,
      description,
      assigneeId: assigneeId || null,
      recurrence,
    })
  }

  return (
    <Modal title={chore ? 'Edit Chore' : 'Add Chore'} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Clean kitchen"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional details..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select
            value={assigneeId}
            onChange={e => setAssigneeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Recurrence type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {RECURRENCE_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRecType(value)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  recType === value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly: day picker */}
        {recType === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Days of week</label>
            <div className="flex gap-1.5">
              {DAYS.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-9 h-9 rounded-full text-xs font-semibold transition-colors ${
                    daysOfWeek.includes(i)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {day[0]}
                </button>
              ))}
            </div>
            {daysOfWeek.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one day.</p>
            )}
          </div>
        )}

        {/* Monthly: day of month */}
        {recType === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of month</label>
            <input
              type="number"
              min={1}
              max={31}
              value={dayOfMonth}
              onChange={e => setDayOfMonth(parseInt(e.target.value) || 1)}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Start / End date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {recType === 'once' ? 'Date' : 'Start Date'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          {recType !== 'once' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || (recType === 'weekly' && daysOfWeek.length === 0)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chore ? 'Save Changes' : 'Add Chore'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
