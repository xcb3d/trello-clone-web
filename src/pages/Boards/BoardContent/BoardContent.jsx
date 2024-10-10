import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumn'
import { mapOrder } from '~/utils/sorts'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'


function BoardContent({ board }) {
  const sensors = useSensors(   
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 500
      }
    }),
    useSensor(KeyboardSensor)
  )

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    console.log('🚀 ~ handleDragEnd ~ event:', event)
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const sourceIndex = orderedColumns.findIndex((c) => (c._id === active.id))
      const targetIndex = orderedColumns.findIndex((c) => (c._id === over.id))
      // const dndOrderedColumnsIds = orderedColumns.map((c) => c._id)
      setOrderedColumns(arrayMove(orderedColumns, sourceIndex, targetIndex))
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumn columns = {orderedColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
