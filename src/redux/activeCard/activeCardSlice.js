import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    hideModalActiveCard: (state) => {
      state.currentActiveCard = null,
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const card = action.payload
      state.currentActiveCard = card
    }
  },
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

export const { showModalActiveCard, hideModalActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}


export const activeCardReducer = activeCardSlice.reducer
