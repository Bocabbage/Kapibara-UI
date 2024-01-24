import axios, { AxiosHeaders } from "axios"
import { APISERVER_URL, REMOTE_TIMEOUT, AUTH_BASE_URL, AUTH_TOKEN_TYPE } from "../configs/remote"

axios.defaults.timeout = REMOTE_TIMEOUT
axios.defaults.baseURL = APISERVER_URL

axios.interceptors.request.use(
    (config) => {
        if(config.baseURL !== AUTH_BASE_URL) {
            // [todo] token valid condition
            if(true) {
                (config.headers as AxiosHeaders).set(
                    'Authorization',
                    AUTH_TOKEN_TYPE + "" // [todo] get access_token
                )
            }
        }

        return config
    }, error => {
        // [todo] test valid
        return Promise.reject(error)
    }
)