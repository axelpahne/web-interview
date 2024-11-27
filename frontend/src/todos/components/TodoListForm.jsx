import React, { useState, useMemo, useEffect } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import { addTodo, updateTodo, deleteTodo } from '../../api'

const TODO_TEMPLATE = {
  text: '',
  completed: false,
  finishDate: '',
  id: '',
  startDate: '',
}

const debounce = (func, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)

  const listId = todoList.id

  const debouncedUpdateTodo = useMemo(
    () =>
      debounce(async (listId, todoId, updatedTodo, prevTodos) => {
        try {
          await updateTodo(listId, todoId, updatedTodo)
          saveTodoList(todoList.id, { todos: prevTodos })
        } catch (error) {
          console.error('Failed to update todo:', error)
        }
      }, 300),
    [saveTodoList, todoList.id]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    saveTodoList(todoList.id, { todos })
  }

  const handleAddTodo = async () => {
    const newTodo = { ...TODO_TEMPLATE, ...{ id: crypto.randomUUID(), startDate: Date.now() } }

    // Optimistic update
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)

    try {
      await addTodo(listId, newTodo)
    } catch (error) {
      console.error('Failed to add todo:', error)

      // Reset state if req error
      setTodos(todos)
    }
  }

  const handleUpdate = (event, todoId) => {
    const newValue = event.target.value

    // Optimistic update
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, text: newValue } : todo
      )

      const updatedTodo = { ...prevTodos.find((todo) => todo.id === todoId), text: newValue }

      debouncedUpdateTodo(listId, todoId, updatedTodo, updatedTodos)

      return updatedTodos
    })
  }

  const handleComplete = (todoId) => {
    const indexToUpdate = todos.findIndex((item) => item.id === todoId)

    if (indexToUpdate !== -1) {
      const prevTodos = [...todos]

      // Optimistic update
      const updatedTodo = [...todos]
      updatedTodo[indexToUpdate] = {
        ...updatedTodo[indexToUpdate],
        completed: !updatedTodo[indexToUpdate].completed,
      }

      setTodos(updatedTodo)
      debouncedUpdateTodo(listId, todoId, updatedTodo[indexToUpdate], prevTodos)
    }
  }

  const handleDelete = async (todoId) => {
    // Optimistic update
    const updatedTodos = todos.filter((todo) => todo.id !== todoId)
    setTodos(updatedTodos) // Update local state

    try {
      await deleteTodo(listId, todoId)

      saveTodoList(listId, { todos: updatedTodos })
      console.log('Deleted successfully and updated parent state')
    } catch (error) {
      console.error('Failed to delete todo:', error)

      // Reset state if req error
      setTodos((prevTodos) => [...prevTodos])
    }
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            {todos?.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>

                <TextField
                  sx={{ flexGrow: 1, marginTop: '1rem' }}
                  label='What to do?'
                  value={item?.text || ''}
                  onChange={(event) => handleUpdate(event, item.id)}
                />

                {item.completed ? (
                  <Button
                    sx={{ my: '8px', mx: '4px' }}
                    size='small'
                    color='secondary'
                    onClick={() => handleComplete(item.id)}
                  >
                    <CheckCircleIcon />
                  </Button>
                ) : (
                  <Button
                    sx={{ my: '8px', mx: '4px' }}
                    size='small'
                    color='secondary'
                    onClick={() => handleComplete(item.id)}
                  >
                    <CheckCircleOutlineIcon />
                  </Button>
                )}

                <Button
                  sx={{ my: '8px', mx: '4px' }}
                  size='small'
                  color='secondary'
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}

            <CardActions>
              <Button type='button' color='primary' onClick={handleAddTodo}>
                Add Todo <AddIcon />
              </Button>

              <Button type='submit' variant='contained' color='primary'>
                Save
              </Button>
            </CardActions>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
