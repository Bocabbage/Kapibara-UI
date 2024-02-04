import { createSlice } from '@reduxjs/toolkit'
import { userRegister, userLogin } from './authActions'
import { getCookie } from '../../utils/cookie'

// Type definitions
type AuthState = {
    loading: boolean,
    userInfo: string | null,
    accessToken: string | null,
    error: string | null,
    success: boolean,
    isLoggedIn: boolean,
}

// Try to find cache in the cookie
const accessToken: string | null = getCookie('access_token')
const userInfo: string | null = getCookie("user_info")

const initialState: AuthState = {
    loading: false,
    userInfo: userInfo,
    accessToken,
    error: null,
    success: false,
    isLoggedIn: accessToken !== null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state: AuthState) => {
            localStorage.removeItem('access_token')
            state.loading = false
            state.userInfo = null
            state.accessToken = null
            state.error = null
            state.isLoggedIn = false
        },
        setCredentials: (state: AuthState, { payload }) => {
            state.userInfo = payload.user_info
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
                state.userInfo = payload.user_info
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