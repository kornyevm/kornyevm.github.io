// TODO: Just use a date library like luxon instead
export const toStartOfDay = (date: Date): Date => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

export const toEndOfDay = (date: Date): Date => {
  const normalized = new Date(date)
  normalized.setHours(23, 59, 59, 999)
  return normalized
}

