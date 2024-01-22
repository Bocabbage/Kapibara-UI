import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const apiServerURL = import.meta.env.SERVER_URL

interface LoginParamsForm {
    account: string;
    password: string;
}

interface RegisterParamsForm {
    account: string;
    username: string;
    password: string;
}

export const userLogin = createAsyncThunk(
    'auth/login',
    async (params: LoginParamsForm, { rejectWithValue }) => {
        try {
            const { account, password } = params

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const { data } = await axios.post(
                `${apiServerURL}/auth/login`,
                { account, password },
                config
            )

            // [todo] add session storage option
            localStorage.setItem('access_token', data.access_token)

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
                    'Content-Type': 'application/json',
                },
            }

            const { data } = await axios.post(
                `${apiServerURL}/auth/register`,
                { account, username, password },
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