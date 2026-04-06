export const MEMBER_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
]

export function getNextColor(existingMembers) {
  const usedColors = new Set(existingMembers.map(m => m.color))
  return MEMBER_COLORS.find(c => !usedColors.has(c)) || MEMBER_COLORS[existingMembers.length % MEMBER_COLORS.length]
}
