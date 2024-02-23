// Async Request Redux
import axios from 'axios'
import { sha256 } from 'js-sha256'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { APISERVER_URL, AUTH_BASE_URL, CLIENT_SALT } from '../../configs/remote'

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