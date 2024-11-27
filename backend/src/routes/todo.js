import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()

const todosFilePath = path.resolve('src/todo.json')

const readTodosFromFile = () => {
  try {
    const data = fs.readFileSync(todosFilePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading todos file:', err)
    return []
  }
}

const writeTodosToFile = (todos) => {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf8')
  } catch (err) {
    console.error('Error writing todos file:', err)
  }
}

// Route that gets all the todos
router.get('/', (req, res) => {
  const todos = readTodosFromFile()
  res.json(todos)
})

// Add a new todo
router.post('/:listId', (req, res) => {
  const listId = req.params.listId
  const input = req.body

  const allLists = readTodosFromFile()

  if (!allLists[listId]) {
    return res.status(404).json({ message: 'List not found' })
  }

  if (input) {
    allLists[listId].todos.push(input)
  }

  writeTodosToFile(allLists)

  res.status(201).json(allLists[listId])
})

// Update todo
router.patch('/:listId/:todoId', (req, res) => {
  const { listId, todoId } = req.params
  const input = req.body

  if (!input || Object.keys(input).length === 0) {
    return res.status(400).json({ message: 'Invalid input, no data provided' })
  }

  const allLists = readTodosFromFile()

  if (!allLists[listId]) {
    return res.status(404).json({ message: 'List not found' })
  }

  const todos = allLists[listId].todos

  console.log('todoId', todoId)
  console.log('todos', todos)

  const todoIndex = todos.findIndex((item) => item.id === todoId)

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' })
  }

  const updatedTodo = {
    ...todos[todoIndex],
    ...input,
  }

  if (input) {
    todos[todoIndex] = updatedTodo
  }

  writeTodosToFile(allLists)

  res.json(updatedTodo)
})

// Delete todo
router.delete('/:listId/:todoId', (req, res) => {
  const { listId, todoId } = req.params
  const allLists = readTodosFromFile()

  const isListInvalid = !allLists[listId]
  if (isListInvalid) {
    return res.status(404).json({ message: 'List not found' })
  }

  const todos = allLists[listId].todos

  const filteredTodos = todos.filter((item) => item.id !== todoId)

  if (filteredTodos.length !== todos.length) {
    allLists[listId].todos = filteredTodos

    writeTodosToFile(allLists)

    res.json(todoId)
  } else {
    res.status(404).json({ message: 'Todo not found' })
  }
})

export default router
