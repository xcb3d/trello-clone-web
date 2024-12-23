import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

export const fetchInvitationAPI = createAsyncThunk(
  'notifications/fetchInvitationAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    // console.log('🚀 ~ updateBoardInvitationAPI ~ status:', status)
    // console.log('🚀 ~ updateBoardInvitationAPI ~ invitationId:', invitationId)
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotification: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications = incomingInvitation
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationAPI.fulfilled, (state, action) => {
      let incomingInvitation = action.payload
      // Đảo ngược để hiện thị cái mới nhất lên đầu
      state.currentNotifications = Array.isArray(incomingInvitation) ? incomingInvitation.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

export const { clearCurrentNotification, updateCurrentNotification, addNotification } = notificationsSlice.actions

export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

export const notificationsReducer = notificationsSlice.reducer
