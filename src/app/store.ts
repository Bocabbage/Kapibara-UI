import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer
    },
    // middleware: ...
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store