import path from 'path'
import { readFromFile, writeToFile } from '../utils/index.js'

const todosFilePath = path.resolve('src/todo.json')

// Get all todo lists
export const getAllTodos = () => {
  return readFromFile(todosFilePath)
}

// Add a new todo to a specific list
export const addTodoToList = (listId, todo) => {
  const allLists = readFromFile(todosFilePath)

  if (!allLists[listId]) {
    throw new Error('List not found')
  }

  allLists[listId].todos.push(todo)
  writeToFile(todosFilePath, allLists)

  return allLists[listId]
}

// Update an existing todo
export const updateTodoInList = (listId, todoId, updates) => {
  const allLists = readFromFile(todosFilePath)

  if (!allLists[listId]) {
    throw new Error('List not found')
  }

  const todos = allLists[listId].todos
  const todoIndex = todos.findIndex((todo) => todo.id === todoId)

  if (todoIndex === -1) {
    throw new Error('Todo not found')
  }

  todos[todoIndex] = { ...todos[todoIndex], ...updates }
  writeToFile(todosFilePath, allLists)

  return todos[todoIndex]
}

// Delete a todo
export const deleteTodoFromList = (listId, todoId) => {
  const allLists = readFromFile(todosFilePath)

  if (!allLists[listId]) {
    throw new Error('List not found')
  }

  const todos = allLists[listId].todos
  const filteredTodos = todos.filter((todo) => todo.id !== todoId)

  if (filteredTodos.length === todos.length) {
    throw new Error('Todo not found')
  }

  allLists[listId].todos = filteredTodos
  writeToFile(todosFilePath, allLists)

  return todoId
}
