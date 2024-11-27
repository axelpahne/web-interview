import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { addTodo, updateTodo, deleteTodo } from '../../api'
import { getRandomFinishDate, debounce, TODO_TEMPLATE } from '../../utils'
import { TodoItem } from './TodoItem'

// Styles
const cardStyle = { margin: '0 1rem' }
const cardContentStyle = { display: 'flex', flexDirection: 'column', flexGrow: 1 }
const formStyle = { display: 'flex', flexDirection: 'column', flexGrow: 1 }

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
    const newTodo = {
      ...TODO_TEMPLATE,
      ...{ id: crypto.randomUUID(), startDate: new Date().toISOString() },
      finishDate: getRandomFinishDate(),
    }
    // Optimistic update
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)

    try {
      await addTodo(listId, newTodo)
      saveTodoList(listId, { todos: updatedTodos })
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
    // Optimistic update
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )

      const updatedTodo = {
        ...prevTodos.find((todo) => todo.id === todoId),
        completed: !prevTodos.find((todo) => todo.id === todoId).completed,
      }

      debouncedUpdateTodo(listId, todoId, updatedTodo, updatedTodos)

      return updatedTodos
    })
  }

  const handleDelete = async (todoId) => {
    // Optimistic update
    const updatedTodos = todos.filter((todo) => todo.id !== todoId)
    setTodos(updatedTodos)

    try {
      await deleteTodo(listId, todoId)
      saveTodoList(listId, { todos: updatedTodos })
    } catch (error) {
      console.error('Failed to delete todo:', error)

      // Reset state if req error
      setTodos((prevTodos) => [...prevTodos])
    }
  }

  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>

        <div style={cardContentStyle}>
          <form onSubmit={handleSubmit} style={formStyle}>
            {todos?.map((item, index) => (
              <TodoItem
                key={item.id}
                item={item}
                index={index}
                onUpdate={handleUpdate}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
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
