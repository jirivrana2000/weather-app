export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'medium',
  }).format(date)

export const formatTime = (timestamp: number): string =>
  new Intl.DateTimeFormat(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000))