export function formatDate(dateInput) {
  let dateString

  // Check if dateInput is a Date object
  if (dateInput instanceof Date) {
    dateString = dateInput.toISOString().split('T')[0]
  } else if (typeof dateInput === 'string') {
    dateString = dateInput
  } else {
    console.error('Invalid date type:', dateInput)
    return ''
  }

  // Check if the dateString is in 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss.sssZ' format
  const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  const isDateTimeFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(
    dateString,
  )

  if (isFullDate || isDateTimeFormat) {
    // If it's in the full datetime format, extract the date part only
    if (isDateTimeFormat) {
      dateString = dateString.split('T')[0]
    }

    return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } else {
    // Check if the dateString is in 'YYYY' format
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
