export const calculateTimeRemaining = (finishDate) => {
  if (!finishDate) return null // No due date set

  const now = new Date()
  const finish = new Date(finishDate)
  const differenceInMs = finish - now

  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (differenceInMs > 0) {
    return `${days} days and ${hours} hours remaining`
  } else {
    return `${Math.abs(days)} days and ${Math.abs(hours)} hours overdue`
  }
}
