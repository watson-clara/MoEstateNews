import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy h:mm a')
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(d)) {
    return 'Today'
  }
  
  if (isYesterday(d)) {
    return 'Yesterday'
  }
  
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  if (startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate)
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

