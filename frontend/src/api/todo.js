import { apiClient } from './apiClient'

/**
 * Fetch all todo lists and their items.
 * @returns {Promise<Object>} All todo lists with their items.
 */
export const fetchTodos = async () => {
  const response = await apiClient('/todo', {
    method: 'GET',
  })
  return response
}

/**
 * Add a new todo to a list.
 * @param {string} listId - ID of the target list.
 * @param {Object} input - New todo data (e.g., text, completed, finishDate).
 * @returns {Promise<Object>} Updated list of todos.
 */
export const addTodo = async (listId, input) => {
  const response = await apiClient(`/todo/${listId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response
}

/**
 * Update an existing todo.
 * @param {string} listId - ID of the list containing the todo.
 * @param {string} todoId - ID of the todo to update.
 * @param {Object} input - Updated todo data (e.g., text, completed, finishDate).
 * @returns {Promise<Object>} The updated todo.
 */
export const updateTodo = async (listId, todoId, input) => {
  const response = await apiClient(`/todo/${listId}/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
  return response
}

/**
 * Delete a todo from a list.
 * @param {string} listId - ID of the list containing the todo.
 * @param {string} todoId - ID of the todo to delete.
 * @returns {Promise<string>} ID of the deleted todo.
 */
export const deleteTodo = async (listId, todoId) => {
  const response = await apiClient(`/todo/${listId}/${todoId}`, {
    method: 'DELETE',
  })
  return response
}
