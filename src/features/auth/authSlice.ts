import { createSlice } from '@reduxjs/toolkit'
import { userRegister, userLogin } from './authActions'

// Type definitions
type AuthState = {
    loading: boolean,
    userInfo: string | null,
    accessToken: string | null,
    error: string | null,
    success: boolean,
    isLoggedIn: boolean,
}

// [todo] add support for sessionStorage
const accessToken = localStorage.getItem('access_token')

const initialState: AuthState = {
    loading: false,
    userInfo: null,
    accessToken,
    error: null,
    success: false,
    isLoggedIn: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state: AuthState) => {
            // [todo] add sessionStorage support
            localStorage.removeItem('access_token')
            state.loading = false
            state.userInfo = null
            state.accessToken = null
            state.error = null
            state.isLoggedIn = false
        },
        setCredentials: (state: AuthState, { payload }) => {
            state.userInfo = payload
        }
    },
    extraReducers: (builder) => {
        builder
            // user login
            // userLogin is an AsyncThunk obj and pending/fulfilled/ are 'actions' of userLogin
            // so add reducers to process: builder.addCase(action, reducer)
            .addCase(userLogin.pending, (state: AuthState) => {
                state.loading = true
                state.isLoggedIn = false
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state: AuthState, { payload }) => {
                state.loading = false
                state.error = null
                state.userInfo = payload
                state.accessToken = payload.access_token
                state.isLoggedIn = true
            })
            .addCase(userLogin.rejected, (state: AuthState, { payload }) => {
                let errorMsg = payload as string
                state.isLoggedIn = false
                state.loading = false
                state.error = errorMsg
            })
            // user register
            .addCase(userRegister.pending, (state: AuthState) => {
                state.loading = true
                state.error = null
            })
            .addCase(userRegister.fulfilled, (state: AuthState) => {
                state.loading = false
                state.error = null
                state.success = true
            })
            .addCase(userRegister.rejected, (state: AuthState, { payload }) => {
                let errorMsg = payload as string
                state.loading = false
                state.error = errorMsg
            })
    },
        
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer