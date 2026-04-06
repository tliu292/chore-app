import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import rrulePlugin from '@fullcalendar/rrule'
import ChoreForm from '../chores/ChoreForm'

const FC_DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
const FC_FREQ = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
}

function choreToFcEvent(chore, member) {
  const color = member?.color || '#94a3b8'
  const rec = chore.recurrence

  if (!rec || rec.type === 'once') {
    return {
      id: chore.id,
      title: chore.title,
      start: rec?.startDate || new Date().toISOString().split('T')[0],
      allDay: true,
      backgroundColor: color,
      borderColor: color,
      extendedProps: { choreId: chore.id, assigneeId: chore.assigneeId, description: chore.description },
    }
  }

  const rrule = {
    freq: FC_FREQ[rec.type],
    dtstart: rec.startDate,
  }

  if (rec.endDate) rrule.until = rec.endDate
  if (rec.type === 'weekly' && rec.daysOfWeek?.length) {
    rrule.byweekday = rec.daysOfWeek.map(d => FC_DAYS[d])
  }
  if (rec.type === 'monthly' && rec.dayOfMonth) {
    rrule.bymonthday = rec.dayOfMonth
  }

  return {
    id: chore.id,
    title: chore.title,
    rrule,
    allDay: true,
    backgroundColor: color,
    borderColor: color,
    extendedProps: { choreId: chore.id, assigneeId: chore.assigneeId, description: chore.description },
  }
}

export default function CalendarView({ chores, members, onUpdateChore, onAddChore }) {
  const [editingChore, setEditingChore] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [clickedDate, setClickedDate] = useState(null)

  const memberMap = useMemo(() => {
    const map = {}
    members.forEach(m => { map[m.id] = m })
    return map
  }, [members])

  const events = useMemo(() =>
    chores.map(c => choreToFcEvent(c, memberMap[c.assigneeId])),
    [chores, memberMap]
  )

  function handleEventClick(info) {
    const chore = chores.find(c => c.id === info.event.id)
    if (chore) setEditingChore(chore)
  }

  function handleDateClick(info) {
    setClickedDate(info.dateStr)
    setShowAddForm(true)
  }

  function renderEventContent(eventInfo) {
    const assigneeId = eventInfo.event.extendedProps.assigneeId
    const member = memberMap[assigneeId]
    return (
      <div className="flex items-center gap-1 px-0.5 truncate">
        {member && (
          <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
            {member.initial}
          </span>
        )}
        <span className="truncate text-[11px] font-medium">{eventInfo.event.title}</span>
      </div>
    )
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Click a date to add a chore, click an event to edit</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          height="100%"
          dayMaxEvents={3}
          moreLinkText={n => `+${n} more`}
        />
      </div>

      {editingChore && (
        <ChoreForm
          chore={editingChore}
          members={members}
          onSave={(data) => {
            onUpdateChore(editingChore.id, data)
            setEditingChore(null)
          }}
          onClose={() => setEditingChore(null)}
        />
      )}

      {showAddForm && (
        <ChoreForm
          chore={clickedDate ? { recurrence: { type: 'once', startDate: clickedDate } } : null}
          members={members}
          onSave={(data) => {
            onAddChore(data)
            setShowAddForm(false)
            setClickedDate(null)
          }}
          onClose={() => { setShowAddForm(false); setClickedDate(null) }}
        />
      )}
    </div>
  )
}
