import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { notificationsReducer } from './notifications/notificationsSlice'

// Cấu hình persist store
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // Định nghĩa các slice được phép duy trì qua mỗi lần f5
  // blacklist: ['activeBoard'] // Định nghĩa các slice được không duy trì qua mỗi lần f5
}

// Combine các reducer trong dự án
const reducer = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})

// Thực hiện persist Reducer
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})