const CHORES_KEY = 'chores_app_chores'
const MEMBERS_KEY = 'chores_app_members'

export function getChores() {
  try {
    return JSON.parse(localStorage.getItem(CHORES_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveChores(chores) {
  localStorage.setItem(CHORES_KEY, JSON.stringify(chores))
}

export function getMembers() {
  try {
    return JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members))
}
