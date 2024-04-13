// import axios, { AxiosHeaders } from "axios"
// import { APISERVER_URL, REMOTE_TIMEOUT, AUTH_BASE_URL, AUTH_TOKEN_TYPE } from "../../../configs/remote"
import axios from "axios";
import { APISERVER_URL, REMOTE_TIMEOUT } from "../../../configs/remote";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../../features/auth/authSlice";

export const AxiosInterceptor = () => {
  axios.defaults.timeout = REMOTE_TIMEOUT;
  axios.defaults.baseURL = APISERVER_URL;

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          const dispatch = useAppDispatch();
          // unauthorized, if the page is log-required,
          // the state change and re-render --> login page
          alert("Login status expired. Please sign in again.");
          dispatch(logout());
          // [todo] check if resolve or reject?
          return Promise.reject(error);
        }
      } else {
        // console.error(`No response error: ${error}`)
        return Promise.reject(error);
      }
    },
  );
};
