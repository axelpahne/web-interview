import { apiClient } from './apiClient'

export const fetchTodos = async () => {
  const response = await apiClient('/todo', {
    method: 'GET',
  })
  return response
}

export const addTodo = async (listId, input) => {
  const response = await apiClient(`/todo/${listId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return response
}

export const updateTodo = async (listId, todoId, input) => {
  const response = await apiClient(`/todo/${listId}/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })

  return response
}

export const deleteTodo = async (listId, todoId) => {
  const response = await apiClient(`/todo/${listId}/${todoId}`, {
    method: 'DELETE',
  })

  return response
}
