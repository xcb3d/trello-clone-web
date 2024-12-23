import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { updateBoardDetailsAPI, moveCardDiffrentColumnAPI, createNewColumnAPI, updateColumnDetailsAPI, deleteColumnDetailsAPI,createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { cloneDeep } from 'lodash'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const { boardId } = useParams()
  console.log('boardId: ', boardId)
  const dispatch = useDispatch()
  const location = useLocation()
  //Không sử dụng staet của component thay vào đó sử dụng state của redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  useEffect(() => {
    // const boardId = '6718c00366ac273827a8bfdf'
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  const createNewColumn = async (columnData) => {
    const createdColumn = await createNewColumnAPI({
      ...columnData,
      boardId: board._id
    })
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    // console.log(board)

    //Update board
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  const createNewCard = async (cardData) => {
    const createdCard = await createNewCardAPI({
      ...cardData,
      boardId: board._id
    })
    //Update board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
      columnToUpdate.cards = [createdCard]
      columnToUpdate.cardOrderIds = [createdCard._id]
    } else {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    // console.log(newBoard)
    // newBoard.columns[1].cards.push(createdCard)
    // newBoard.columns[1].cardOrderIds.push(createdCard._id)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  //Update board when move column
  const moveColumns = (newOrderedColumns) => {
    const newColumnOrderIds = newOrderedColumns.map((column) => column._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = newOrderedColumns
    newBoard.columnOrderIds = newColumnOrderIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    //Call api to update board

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newColumnOrderIds
    })
  }

  //Update board when move card in the same column
  //Only update columnOrderIds
  const moveCardSameColumn = (newOrderedCards, newOrderedCardsOrderIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = newOrderedCards
      columnToUpdate.cardOrderIds = newOrderedCardsOrderIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // console.log(newBoard)
    //Call api to update board
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: newOrderedCardsOrderIds
    })
  }

  const moveCardDifferentColumn = (currentCardId, prevColumnId, nextColumnId, newOrderedColumns) => {
    // console.log("🚀 ~ moveCardDifferentColumn ~ currentCardId:", currentCardId)
    // console.log("🚀 ~ moveCardDifferentColumn ~ prevColumnId:", prevColumnId)
    // console.log("🚀 ~ moveCardDifferentColumn ~ newOrderedColumns:", newOrderedColumns)
    // console.log("🚀 ~ moveCardDifferentColumn ~ nextColumnId:", nextColumnId)

    const newBoard = cloneDeep(board)
    newBoard.columns = newOrderedColumns
    newBoard.columnOrderIds = newBoard.columns.map((column) => column._id)
    // console.log(newBoard)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    //Call api to update board
    let prevCardOrderIds = newOrderedColumns.find((column) => column._id === prevColumnId).cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder')) prevCardOrderIds = []
    moveCardDiffrentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: newOrderedColumns.find((column) => column._id === nextColumnId).cardOrderIds
    })
  }

  //Delete column and all its cards
  const deleteColumnDetails = (columnId) => {
    const newBoard = cloneDeep(board)
    newBoard.columns = newBoard.columns.filter((column) => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columns.map((column) => column._id)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    //Call api to update board
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
      // console.log(res)
    })
  }
  if (!board) return (
    <PageLoadingSpinner caption="Loading board details..." />
  )
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng mở dựa theo điều kiện có tồn tại data activeCard trong redux thì mới render. Mỗi thời điểm chỉ tồn tại 1 Modal Card đang active */}
      <ActiveCard/>
      {/* <ActiveCard /> */}

      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // createNewColumn={createNewColumn}
        // createNewCard={createNewCard}
        // deleteColumnDetails={deleteColumnDetails}

        moveColumns={moveColumns}
        moveCardSameColumn={moveCardSameColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
      />
    </Container>
  )
}

export default Board