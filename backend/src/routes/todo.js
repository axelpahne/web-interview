import express from 'express'
import {
  getAllTodos,
  addTodoToList,
  updateTodoInList,
  deleteTodoFromList,
} from '../services/todosService.js'

const router = express.Router()

/**
 * @route GET /
 * @description Retrieve all todo lists with their associated todos.
 * @returns {Object.<string, TodoList>} JSON object of all todo lists keyed by list IDs.
 * @throws {500} Internal server error if the todos cannot be fetched.
 */
router.get('/', (req, res) => {
  try {
    const todos = getAllTodos()
    res.json(todos)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos' })
  }
})

/**
 * @route POST /:listId
 * @description Add a new todo to the specified list.
 * @param {string} req.params.listId - The ID of the list to which the todo will be added.
 * @param {Object} req.body - The todo data (e.g., text, completed, finishDate).
 * @returns {TodoList} The updated list with the new todo.
 * @throws {404} List not found if the specified list ID does not exist.
 */
router.post('/:listId', (req, res) => {
  try {
    const { listId } = req.params
    const todo = req.body
    const updatedList = addTodoToList(listId, todo)
    res.status(201).json(updatedList)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

/**
 * @route PATCH /:listId/:todoId
 * @description Update an existing todo in the specified list.
 * @param {string} req.params.listId - The ID of the list containing the todo.
 * @param {string} req.params.todoId - The ID of the todo to update.
 * @param {Object} req.body - The fields to update in the todo (e.g., text, completed).
 * @returns {TodoItem} The updated todo object.
 * @throws {404} List or Todo not found if the IDs do not exist.
 * @throws {400} Bad request if the request body is empty.
 */
router.patch('/:listId/:todoId', (req, res) => {
  try {
    const { listId, todoId } = req.params
    const updates = req.body
    const updatedTodo = updateTodoInList(listId, todoId, updates)
    res.json(updatedTodo)
  } catch (error) {
    const status =
      error.message === 'List not found' || error.message === 'Todo not found' ? 404 : 400
    res.status(status).json({ message: error.message })
  }
})

/**
 * @route DELETE /:listId/:todoId
 * @description Delete a specific todo from a list.
 * @param {string} req.params.listId - The ID of the list containing the todo.
 * @param {string} req.params.todoId - The ID of the todo to delete.
 * @returns {Object} An object containing the ID of the deleted todo.
 * @throws {404} List or Todo not found if the IDs do not exist.
 */
router.delete('/:listId/:todoId', (req, res) => {
  try {
    const { listId, todoId } = req.params
    const deletedTodoId = deleteTodoFromList(listId, todoId)
    res.json({ id: deletedTodoId })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

export default router
