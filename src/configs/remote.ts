const APISERVER_URL = "https://api.kapibara.local.com:30009"; // [todo] get config from env: import.meta.env.VITE_SERVER_URL
const REMOTE_TIMEOUT = 30000; // ms
const AUTH_BASE_URL = "auth/v1";
const AUTH_TOKEN_TYPE = "Bearer ";
const CLIENT_SALT = "BABY_TEST_SALT";

export {
  APISERVER_URL,
  REMOTE_TIMEOUT,
  AUTH_BASE_URL,
  AUTH_TOKEN_TYPE,
  CLIENT_SALT,
};
