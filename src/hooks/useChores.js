import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getChores, saveChores } from '../utils/storage'

export function useChores() {
  const [chores, setChores] = useState(() => getChores())

  useEffect(() => {
    saveChores(chores)
  }, [chores])

  function addChore(data) {
    const chore = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      assigneeId: data.assigneeId || null,
      recurrence: data.recurrence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setChores(prev => [...prev, chore])
    return chore
  }

  function updateChore(id, data) {
    setChores(prev =>
      prev.map(c =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      )
    )
  }

  function removeChore(id) {
    setChores(prev => prev.filter(c => c.id !== id))
  }

  function unassignMember(memberId) {
    setChores(prev =>
      prev.map(c =>
        c.assigneeId === memberId ? { ...c, assigneeId: null } : c
      )
    )
  }

  return { chores, addChore, updateChore, removeChore, unassignMember }
}
