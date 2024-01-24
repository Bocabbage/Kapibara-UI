const APISERVER_URL = import.meta.env.VITE_SERVER_URL
const REMOTE_TIMEOUT = 30000      // ms
const AUTH_BASE_URL = '/oauth'
const AUTH_TOKEN_TYPE = 'Bearer '

export {
    APISERVER_URL,
    REMOTE_TIMEOUT,
    AUTH_BASE_URL,
    AUTH_TOKEN_TYPE,
}