// Async Request Redux
import axios, { AxiosError } from 'axios'
import { sha256 } from 'js-sha256'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { APISERVER_URL, AUTH_BASE_URL, CLIENT_SALT } from '../../configs/remote'
import { STORE_USER_INFO_KEY } from '../../configs/local'

export interface LoginParamsForm {
    account: string;
    password: string;
    rememberMe: boolean;
}

interface RegisterParamsForm {
    account: string;
    username: string;
    password: string;
}

// When dispatch an userLogin(), first dispatch a 'pending' action,
// after the async-function finished, dispatch another action of 'fulfilled'/'reject'
export const userLogin = createAsyncThunk(
     // action prefix
    'auth/login',
    // payload creator
    async (params: LoginParamsForm, { rejectWithValue }) => {
        try {
            const { account, password } = params

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            }

            const { data } = await axios.post(
                `${APISERVER_URL}/${AUTH_BASE_URL}/login`,
                { 
                    account: account, 
                    password: sha256(password + CLIENT_SALT),
                },
                config
            )

            params.rememberMe ? localStorage.setItem(STORE_USER_INFO_KEY, data.user_name) : sessionStorage.setItem(STORE_USER_INFO_KEY, data.user_name)
            return data
        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data.message) {
                    // Client error
                    switch(error.response.status) {
                        case 422: alert("invalid account or password!"); break;
                        case 500: alert("problems happened on the server!"); break;
                        default: alert("Unexpected error happened on login."); break;
                    }
    
                    return rejectWithValue(error.response.data.message)
                } else {
                    alert("Unexpected empty response happened on login.")
                    return rejectWithValue(error.message)
                }
            }
            else {
                // Unexpected error
                alert("Unexpected not-request-error happened on login.")
                return rejectWithValue(error.message)
            }
        }
    }
)

// [todo] impl finish
export const userRegister = createAsyncThunk(
    'auth/register',
    async (params: RegisterParamsForm, { rejectWithValue }) => {
        try {
            const { account, username, password } = params

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            }

            const { data } = await axios.post(
                `${APISERVER_URL}/${AUTH_BASE_URL}/register`,
                { 
                    account: account, 
                    username: username, 
                    password: sha256(password + CLIENT_SALT), 
                },
                config
            )

            return data
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const testAuthApi = createAsyncThunk(
    // action prefix
   'auth/authtest',
   // payload creator
   async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(
            `${APISERVER_URL}/test/v1/echo`, 
            {
                withCredentials: true,
                params: {
                    message: "hello",
                },
            }
        )
        console.log(data)
        alert(`Get data: ${data.msg}`)
    } catch (error: any) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.data.message) {
                // Client error
                switch(error.response.status) {
                    case 401: alert("login expired, please sign in again!"); break;
                    case 500: alert("problems happened on the server!"); break;
                    default: alert("Unexpected error happened on login."); break;
                }
                return rejectWithValue(error.message)
            } else {
                alert("Unexpected empty response happened on login.")
                return rejectWithValue(error.message)
            }
        }
        else {
            // Unexpected error
            alert("Unexpected not-request-error happened on login.")
            return rejectWithValue(error.message)
        }
       }
   }
)