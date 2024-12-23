import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'

//Initial state
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (Bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Khởi tạo slice trong redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhân dữ liệu vào reducer
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết

      // Cập nhật lại dữ liệu
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      const card = action.payload
      const column = state.currentActiveBoard.columns.find(c => c._id === card.columnId)
      if (column) {
        const cardToUpdate = column.cards.find(c => c._id === card._id)
        if (cardToUpdate) {
          Object.assign(cardToUpdate, card)
          Object.keys(card).forEach(key => {
            cardToUpdate[key] = card[key]
          })
        }
      }
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất động bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // actiion.payload ở đây chính là response.data trả về ở trên
      let board = action.payload
      // Xử lý dữ liệu nếu cần thiết
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.FE_allUsers = board?.onwers.concat(board?.members)
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // Cập nhật lại dữ liệu
      state.currentActiveBoard = board
    })
  }
})

//Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reduce (chạy đồng bộ)
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

//Selector: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer