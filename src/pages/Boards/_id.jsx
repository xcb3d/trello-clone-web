import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, updateBoardDetailsAPI, moveCardDiffrentColumnAPI, createNewColumnAPI, updateColumnDetailsAPI, deleteColumnDetailsAPI,createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '6718c00366ac273827a8bfdf'
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      console.log(board)
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (columnData) => {
    const createdColumn = await createNewColumnAPI({
      ...columnData,
      boardId: board._id
    })
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    // console.log(board)

    //Update board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (cardData) => {
    const createdCard = await createNewCardAPI({
      ...cardData,
      boardId: board._id
    })
    //Update board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
      columnToUpdate.cards = [createdCard]
      columnToUpdate.cardOrderIds = [createdCard._id]
    } else {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    console.log(newBoard)
    // newBoard.columns[1].cards.push(createdCard)
    // newBoard.columns[1].cardOrderIds.push(createdCard._id)
    setBoard(newBoard)
  }

  //Update board when move column
  const moveColumns = (newOrderedColumns) => {
    const newColumnOrderIds = newOrderedColumns.map((column) => column._id)
    const newBoard = { ...board }
    newBoard.columns = newOrderedColumns
    newBoard.columnOrderIds = newColumnOrderIds
    setBoard(newBoard)

    //Call api to update board

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newColumnOrderIds
    })
  }

  //Update board when move card in the same column
  //Only update columnOrderIds
  const moveCardSameColumn = (newOrderedCards, newOrderedCardsOrderIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = newOrderedCards
      columnToUpdate.cardOrderIds = newOrderedCardsOrderIds
    }
    setBoard(newBoard)
    console.log(newBoard)
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

    const newBoard = { ...board }
    newBoard.columns = newOrderedColumns
    newBoard.columnOrderIds = newBoard.columns.map((column) => column._id)
    // console.log(newBoard)
    setBoard(newBoard)
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
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((column) => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columns.map((column) => column._id)
    setBoard(newBoard)

    //Call api to update board
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
      console.log(res)
    })
  }
  if (!board) return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardSameColumn={moveCardSameColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board