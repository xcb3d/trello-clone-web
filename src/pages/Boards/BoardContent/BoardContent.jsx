import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumn'
import { mapOrder } from '~/utils/sorts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  DragOverlay,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'
import { MouseSensor, TouchSensor } from '~/customLib/DndKitSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}


function BoardContent({ board, moveColumns, moveCardSameColumn, moveCardDifferentColumn }) {
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldActiveColumn, setOldActiveColumn] = useState(null)

  //Điểm va chạm cuối cùng xử lý toàn bộ hành động drop
  const lastOverId = useRef(null)

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

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }
      
      //Tìm điểm giao nhau
      const pointerIntersection = pointerWithin(args)

      //Fix bug khi kéo card có img kéo vào nơi khoảng không tồn tại column
      if (pointerIntersection?.length === 0) return
      // const intersections = !!pointerIntersection?.length ? pointerIntersection : rectIntersection(args)

      //Tìm overId đầu tiên
      let overId = getFirstCollision(pointerIntersection)?.id
      if (overId) {
        const intersectColumn = orderedColumns.find(
          (column) => column._id === overId
        )
        if (intersectColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                intersectColumn?.cardOrderIds?.includes(container.id)
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

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

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  //Tìm column chứa cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    )
  }

  //Cập nhật lại state khi di chuển card giữa 2 column khác nhau
  const moveCardBetweenDifferentColumn = (
    overCardId,
    activeCardId,
    activeCardData,
    overColumn,
    activeColumn,
    active,
    over,
    triggerForm
  ) => {
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

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      )

      //Column cũ
      if (nextActiveColumn) {
        //Xoá card ở column đang kéo
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeCardId
        )

        //Nếu column cũ trống thì thêm placeholder card
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //Cập nhập mảng OrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }

      //Column mới
      if (nextOverColumn) {
        //Kiểm tra card đang kéo có tồn tại trong overColumn hay không. Nếu có thì cần xoá nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeCardId
        )
        //Thêm card đang kéo vào column đích theo vị trí mới

        // Chuẩn hoá columnId
        const activeCardDate = {
          ...activeCardData,
          columnId: nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          activeCardDate
        )

        //Xoá placeholder card nếu tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )
        //Cập nhập mảng OrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }
      if (triggerForm === 'handleDragEnd') {
        moveCardDifferentColumn(activeCardId, oldActiveColumn._id, nextOverColumn._id, nextColumns)
      }
      return nextColumns
    })
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
      moveCardBetweenDifferentColumn(
        overCardId,
        activeCardId,
        activeCardData,
        overColumn,
        activeColumn,
        active,
        over,
        'handleDragOver'
      )
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
      const { id: overCardId } = over
      // Tìm 2 cái column theo card đang được kéo và card đang tương tác
      const activeColumn = findColumnByCardId(activeCardId)
      const overColumn = findColumnByCardId(overCardId)
      //Nếu không thấy card đang được kéo hoặc card đang tương tác thì không làm gì
      if (!activeColumn || !overColumn) return

      if (oldActiveColumn._id !== overColumn._id) {
        //Xử lý kéo thả card trong các column khác nhau
        moveCardBetweenDifferentColumn(
          overCardId,
          activeCardId,
          activeCardData,
          overColumn,
          activeColumn,
          active,
          over,
          'handleDragEnd'
        )
      } else {
        //Xử lý kéo thả card trong cùng column
        //Lấy index cũ
        const sourceCardIndex = oldActiveColumn?.cards?.findIndex(
          (c) => c._id === activeCardId
        )
        //Lấy index mới
        const targetCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )
        const newOrderedCards = arrayMove(
          oldActiveColumn?.cards,
          sourceCardIndex,
          targetCardIndex
        )
        const newOrderedCardsOrderIds = newOrderedCards.map((card) => card._id)

        setOrderedColumns((prevColumn) => {
          const nextColumn = cloneDeep(prevColumn)

          //Tìm column đang thả
          const targetColumn = nextColumn.find(
            (column) => column._id === overColumn._id
          )
          //Cập nhật lại dữ liệu
          targetColumn.cardOrderIds = newOrderedCardsOrderIds
          targetColumn.cards = newOrderedCards
          return nextColumn
        })
        moveCardSameColumn(newOrderedCards, newOrderedCardsOrderIds, oldActiveColumn._id)
      }
    }

    //Kéo thả column
    if (
      activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      //Lấy index từ column kéo
      const sourceColumnIndex = orderedColumns.findIndex(
        (c) => c._id === active.id
      )
      //Lấy index từ column đích
      const targetColumnIndex = orderedColumns.findIndex(
        (c) => c._id === over.id
      )
      // const dndOrderedColumnsIds = orderedColumns.map((c) => c._id)
      //Cập nhật state dữ liệu
      const newOrderedColumns = arrayMove(orderedColumns, sourceColumnIndex, targetColumnIndex)
      setOrderedColumns(newOrderedColumns)
      moveColumns(newOrderedColumns)
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
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
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
