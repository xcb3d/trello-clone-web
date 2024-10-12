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
  closestCorners
} from '@dnd-kit/core'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, set } from 'lodash'

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
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldActiveColumn, setOldActiveColumn] = useState(null)

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
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemData(event?.active?.data?.current)

    //Nếu kéo card thì mới set lại columnId cũ
    if (event?.active?.data?.current?.columnId) {
      setOldActiveColumn(findColumnByCardId(event?.active?.id))
    }
  }

  //Trigger trong quá trình kéo. Event chỉ dùng để kéo card
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    if (!over || !active) return
    //Card đang được kéo
    const {
      id: activeCardId,
      data: { current: activeCardData }
    } = active
    //Card đang tương tác
    const { id: overCardId, data: overCardData } = over
    // Tìm 2 cái column theo card đang được kéo và card đang tương tác
    const activeColumn = findColumnByCardId(activeCardId)
    const overColumn = findColumnByCardId(overCardId)

    //Nếu không thấy card đang được kéo hoặc card đang tương tác thì không làm gì
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

    //Kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeCardId,
        data: { current: activeCardData }
      } = active
      //Card đang tương tác
      const { id: overCardId, data: overCardData } = over
      // Tìm 2 cái column theo card đang được kéo và card đang tương tác
      const overColumn = findColumnByCardId(overCardId)
      //Nếu không thấy card đang được kéo hoặc card đang tương tác thì không làm gì
      if (!oldActiveColumn || !overColumn) return

      if (oldActiveColumn._id !== overColumn._id) {
        //Xử lý kéo thả card trong các column khác nhau
      } else {
        //Xử lý kéo thả card trong cùng column
        //Lấy index cũ
        const sourceCardIndex = oldActiveColumn?.cards?.findIndex((c) => c._id === activeCardId)
        // console.log("🚀 ~ handleDragEnd ~ sourceCardIndex:", sourceCardIndex)
        //Lấy index mới
        const targetCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId)
        // console.log("🚀 ~ handleDragEnd ~ targetCardIndex:", targetCardIndex)
        const dndOrderedCards = arrayMove(oldActiveColumn?.cards, sourceCardIndex, targetCardIndex)
        console.log("🚀 ~ handleDragEnd ~ dndOrderedCards:", dndOrderedCards)
        
        setOrderedColumns((prevColumn) => {
          const nextColumn = cloneDeep(prevColumn)

          //Tìm column đang thả
          const targetColumn = nextColumn.find((column) => column._id === overColumn._id)
          console.log("🚀 ~ setOrderedColumns ~ targetColumn:", targetColumn)
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)
          targetColumn.cards = dndOrderedCards
          return nextColumn
        })
      }
    }

    //Kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      //Lấy index từ column kéo
      const sourceColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
      //Lấy index từ column đích
      const targetColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)
      // const dndOrderedColumnsIds = orderedColumns.map((c) => c._id)
      //Cập nhật state dữ liệu
      setOrderedColumns(arrayMove(orderedColumns, sourceColumnIndex, targetColumnIndex))
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldActiveColumn(null)
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      //Fix card có img thì không thể kéo qua column khác
      collisionDetection={closestCorners}
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
          {(activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && (
            <Column column={activeDragItemData} />
          )}
          {(activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
