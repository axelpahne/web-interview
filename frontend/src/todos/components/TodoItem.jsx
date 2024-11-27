import React from 'react'
import { TextField, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { calculateTimeRemaining } from '../../utils'

// Styles
const todoItemContainerStyle = {
  display: 'grid',
  gridTemplateAreas: `
    "index text remaining complete delete"
  `,
  gridTemplateColumns: '0.5fr 3fr 2fr 0.5fr 0.5fr',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '12px',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '8px',
}

const indexStyle = {
  gridArea: 'index',
  textAlign: 'center',
  fontWeight: 'bold',
}

const textFieldStyle = {
  gridArea: 'text',
  marginTop: '0',
}

const remainingTimeStyle = (isOverdue) => ({
  gridArea: 'remaining',
  textAlign: 'center',
  color: isOverdue ? 'red' : 'green',
})

const completeButtonStyle = (completed) => ({
  gridArea: 'complete',
  justifySelf: 'center',
  color: completed ? 'green' : 'gray',
})

const deleteButtonStyle = {
  gridArea: 'delete',
  justifySelf: 'center',
  color: 'secondary.main',
}

export const TodoItem = ({ item, index, onUpdate, onComplete, onDelete }) => {
  const isOverdue = new Date(item.finishDate) < new Date()

  return (
    <div style={todoItemContainerStyle}>
      <Typography sx={indexStyle} variant='h6'>
        {index + 1}
      </Typography>

      <TextField
        sx={textFieldStyle}
        label='What to do?'
        value={item.text || ''}
        onChange={(event) => onUpdate(event, item.id)}
      />

      <Typography sx={remainingTimeStyle(isOverdue)}>
        {calculateTimeRemaining(item.finishDate) || 'No due date'}
      </Typography>

      <Button
        sx={completeButtonStyle(item.completed)}
        size='small'
        onClick={() => onComplete(item.id)}
      >
        {item.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
      </Button>

      <Button sx={deleteButtonStyle} size='small' onClick={() => onDelete(item.id)}>
        <DeleteIcon />
      </Button>
    </div>
  )
}
