import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumn'
import { mapOrder } from '~/utils/sorts'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  closestCenter
} from '@dnd-kit/core'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //Animation khi kết thúc hành động drop
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    }),
    duration: 250
  }

  //Tối ưu các loại chạm trên pc và mobile
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
    })
  )

  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  // console.log('🚀 ~ BoardContent ~ activeDragItemId:', activeDragItemId)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  // console.log('🚀 ~ BoardContent ~ activeDragItemType:', activeDragItemType)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  // console.log('🚀 ~ BoardContent ~ activeDragItemData:', activeDragItemData)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //Tìm column chứa cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    )
  }

  //Trigger khi bắt đầu drag
  const handleDragStart = (event) => {
    // console.log('🚀 ~ handleDragStart ~ event:', event)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemData(event?.active?.data?.current)
  }

  //Trigger trong quá trình kéo. Event chỉ dùng để kéo card
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // console.log("🚀 ~ handleDragOver ~ event:", event)

    const { active, over } = event
    if (!over || !active) return
    //Card đang được kéo
    const {
      id: activeCardId,
      data: { current: activeCardData }
    } = active
      // console.log("🚀 ~ handleDragOver ~ activeCardId:", activeCardId)
    //Card đang tương tác
    const { id: overCardId, data: overCardData } = over
    // console.log("🚀 ~ handleDragOver ~ overCardId:", overCardId)

    // Tìm 2 cái column theo card đang được kéo và card đang tương tác
    const activeColumn = findColumnByCardId(activeCardId)
    // console.log("🚀 ~ handleDragOver ~ activeColumn:", activeColumn)
    const overColumn = findColumnByCardId(overCardId)
    // console.log("🚀 ~ handleDragOver ~ overColumn:", overColumn)

    if (!activeColumn || !overColumn) return

    //Kiểm tra nếu 2 column khác nhau thì xử lý nếu không thì không làm gì
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        //Tìm vị trí của overCard trong column đích (Nơi card sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        )
        //Logic tính toán vị trí index mới (trên hoặc dưới overCard)
        let newCardIndex
        const isBelowOverItem =
        active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.slength + 1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)

        if (nextActiveColumn) {
          //Xoá card ở column đang kéo
          nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeCardId)

          //Cập nhập mảng OrderIds
          nextActiveColumn.columnOrderIds = nextActiveColumn.cards.map((card) => card._id)
        }

        if (nextOverColumn) {
          //Kiểm tra card đang kéo có tồn tại trong overColumn hay không. Nếu có thì cần xoá nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeCardId)
          //Thêm card đang kéo vào column đích theo vị trí mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeCardData)
          //Cập nhập mảng OrderIds
          nextOverColumn.columnOrderIds = nextOverColumn.cards.map((card) => card._id)
        }
        return nextColumns
      })
    }
  }

  //Trigger khi drop
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || !active) return

    if (active.id !== over.id) {
      const sourceIndex = orderedColumns.findIndex((c) => c._id === active.id)
      const targetIndex = orderedColumns.findIndex((c) => c._id === over.id)
      // const dndOrderedColumnsIds = orderedColumns.map((c) => c._id)
      setOrderedColumns(arrayMove(orderedColumns, sourceIndex, targetIndex))
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType || !activeDragItemId) && null}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
