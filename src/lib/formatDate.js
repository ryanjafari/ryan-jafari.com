export function formatDate(dateString) {
  // Check if the input dateString is in 'YYYY-MM-DD' format
  const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString)

  if (isFullDate) {
    return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } else {
    // Check if the input dateString is in 'YYYY' format
    const isYearOnly = /^\d{4}$/.test(dateString)
    if (isYearOnly) {
      return dateString
    } else {
      // Handle invalid date format
      console.error('Invalid date format:', dateString)
      return ''
    }
  }
}
