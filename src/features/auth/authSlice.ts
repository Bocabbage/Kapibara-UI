import { createSlice } from '@reduxjs/toolkit'
import { userRegister, userLogin, testAuthApi } from './authActions'
import { STORE_USER_INFO_KEY } from '../../configs/local'

// Type definitions
type AuthState = {
    loading: boolean,
    userName: string | null,
    // accessToken: string | null,
    error: string | null,
    success: boolean,
}

// Try to find cache in the cookie
// const accessToken: string | null = getCookie('access_token')
const userName_local: string | null = localStorage.getItem(STORE_USER_INFO_KEY)

const initialState: AuthState = {
    loading: false,
    userName: userName_local ? userName_local : sessionStorage.getItem(STORE_USER_INFO_KEY),
    // accessToken,
    error: null,
    success: false,
}

const _logout = (state: AuthState) => {
    state.loading = false
    state.userName = null
    // state.accessToken = null
    state.error = null
    state.success = false
    
    sessionStorage.removeItem(STORE_USER_INFO_KEY)
    localStorage.removeItem(STORE_USER_INFO_KEY)
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state: AuthState) => {
            _logout(state)
        },
        // setCredentials: (state: AuthState, { payload }) => {
        //     state.userInfo = payload.user_info
        // }
    },
    extraReducers: (builder) => {
        builder
            // user login
            // userLogin is an AsyncThunk obj and pending/fulfilled/ are 'actions' of userLogin
            // so add reducers to process: builder.addCase(action, reducer)
            .addCase(userLogin.pending, (state: AuthState) => {
                state.loading = true
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state: AuthState, { payload }) => {
                state.loading = false
                state.error = null
                state.userName = payload.user_name
                state.success = true
                // state.accessToken = payload.access_token
            })
            .addCase(userLogin.rejected, (state: AuthState, { payload }) => {
                let errorMsg = payload as string
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
            .addCase(testAuthApi.rejected, (state: AuthState) => {
                _logout(state)
            })
    },
        
})

export const { logout } = authSlice.actions
export default authSlice.reducer