import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getMembers, saveMembers } from '../utils/storage'
import { getNextColor } from '../utils/colors'

export function useMembers() {
  const [members, setMembers] = useState(() => getMembers())

  useEffect(() => {
    saveMembers(members)
  }, [members])

  function addMember(data) {
    const member = {
      id: uuidv4(),
      name: data.name.trim(),
      initial: data.name.trim()[0].toUpperCase(),
      color: data.color || getNextColor(members),
      createdAt: new Date().toISOString(),
    }
    setMembers(prev => [...prev, member])
    return member
  }

  function updateMember(id, data) {
    setMembers(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, ...data, initial: (data.name || m.name)[0].toUpperCase() }
          : m
      )
    )
  }

  function removeMember(id) {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  function getMember(id) {
    return members.find(m => m.id === id)
  }

  return { members, addMember, updateMember, removeMember, getMember }
}
