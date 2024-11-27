export const getRandomFinishDate = () => {
  const now = new Date()

  const minHours = 1
  const maxHours = 20
  const randomMilliseconds = Math.floor(
    Math.random() * (maxHours - minHours + 1) * 60 * 60 * 1000 + minHours * 60 * 60 * 1000
  )
  const finishDate = new Date(now.getTime() + randomMilliseconds)

  return finishDate.toISOString()
}
