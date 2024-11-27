import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'
import { fetchTodos } from '../../api'

// Styles
const cardStyle = { margin: '1rem' }
const cardContentStyle = { padding: '1rem' }
const listItemTextStyle = (completed) => ({
  color: completed ? 'green' : 'inherit',
})

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    const fetchAndSetTodos = async () => {
      try {
        const todos = await fetchTodos()
        setTodoLists(todos)
      } catch (error) {
        console.error('Failed to fetch todos:', error.message) // Logga fel
      }
    }

    fetchAndSetTodos()
  }, [])

  // Helper to check if a list is completed
  const isListCompleted = (listId) => {
    const todos = todoLists[listId]?.todos || []
    return todos.length > 0 && todos.every((todo) => todo.completed)
  }

  if (!Object.keys(todoLists).length) return null

  return (
    <Fragment>
      <Card style={{ ...cardStyle, ...style }}>
        <CardContent style={cardContentStyle}>
          <Typography component='h2'>My Todo Lists</Typography>

          <List>
            {Object.keys(todoLists).map((key) => {
              const completed = isListCompleted(key)
              return (
                <ListItemButton key={key} onClick={() => setActiveList(key)}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${todoLists[key].title} ${completed ? '(Completed)' : ''}`}
                    style={listItemTextStyle(completed)}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </CardContent>
      </Card>

      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={(id, { todos }) => {
            const listToUpdate = todoLists[id]
            setTodoLists({
              ...todoLists,
              [id]: { ...listToUpdate, todos },
            })
          }}
        />
      )}
    </Fragment>
  )
}
