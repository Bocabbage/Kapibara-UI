import axios, { AxiosHeaders } from "axios"
import { APISERVER_URL, REMOTE_TIMEOUT, AUTH_BASE_URL, AUTH_TOKEN_TYPE } from "../../../configs/remote"

export const AxiosInterceptor = (accessToken: string | null) => {
    axios.defaults.timeout = REMOTE_TIMEOUT
    axios.defaults.baseURL = APISERVER_URL

    axios.interceptors.request.use(
        (config) => {
            if(config.baseURL !== AUTH_BASE_URL) {
                if(accessToken !== null) {
                    (config.headers as AxiosHeaders).set(
                        'Authorization',
                        AUTH_TOKEN_TYPE + accessToken
                    )
                }
            }
            return config
        }, error => {
            // [todo] test valid
            return Promise.reject(error)
        }
    )

    axios.interceptors.response.use(res => {
        if(res.status === 200) {
            return Promise.resolve(res)
        }
        else {
            // [todo] data enhancement
            const message = `${res.status}`
            return Promise.reject(Error(message))
        }
    }, error => {
        return Promise.reject(error)
    })
}