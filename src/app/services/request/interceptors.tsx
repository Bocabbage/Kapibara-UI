// import axios, { AxiosHeaders } from "axios"
// import { APISERVER_URL, REMOTE_TIMEOUT, AUTH_BASE_URL, AUTH_TOKEN_TYPE } from "../../../configs/remote"
import axios from "axios"
import { APISERVER_URL, REMOTE_TIMEOUT } from "../../../configs/remote"
import { useAppDispatch } from "../../hooks"
import { logout } from "../../../features/auth/authSlice"


export const AxiosInterceptor = () => {
    axios.defaults.timeout = REMOTE_TIMEOUT
    axios.defaults.baseURL = APISERVER_URL

    // axios.interceptors.request.use(
    //     (config) => {
    //         if(config.baseURL !== AUTH_BASE_URL) {
    //             if(accessToken !== null) {
    //                 (config.headers as AxiosHeaders).set(
    //                     'Authorization',
    //                     AUTH_TOKEN_TYPE + accessToken
    //                 )
    //             }
    //         }
    //         return config
    //     }, error => {
    //         // [todo] test valid
    //         return Promise.reject(error)
    //     }
    // )

    axios.interceptors.response.use(res => {
        if(res.status === 200) {
            return Promise.resolve(res)
        }
        else if(res.status == 401) {
            const dispatch = useAppDispatch()
            // unauthorized, if the page is log-required, 
            // the state change and re-render --> login page
            dispatch(logout())
            // [todo] check if resolve or reject?
            return Promise.resolve(res)
        }
        else {
            const message = `${res.status}`
            return Promise.reject(Error(message))
        }
    }, error => {
        return Promise.reject(error)
    })
}