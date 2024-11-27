import fs from 'fs'
import path from 'path'

// Generic function to read from a file
export const readFromFile = (filePath) => {
  try {
    const absolutePath = path.resolve(filePath)
    const data = fs.readFileSync(absolutePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(`Error reading file at ${filePath}:`, err)
    return {}
  }
}

// Generic function to write to a file
export const writeToFile = (filePath, data) => {
  try {
    const absolutePath = path.resolve(filePath)
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.error(`Error writing to file at ${filePath}:`, err)
  }
}
