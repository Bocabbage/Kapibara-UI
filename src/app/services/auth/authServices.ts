import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query"

const baseUrl = import.meta.env.SERVER_URL

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
        },
    }),
    endpoints: (build) => ({
        getUserDetails: build.query({
            query: () => ({
                // [todo] profile apis
                url: '',
                method: 'GET',
            }),
        }),
    }),
})

export const { useGetUserDetailsQuery } = authApi