// import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  LoaderFunctionArgs,
} from "react-router-dom";
import axios from "axios";
import { logout } from "./features/auth/authSlice.ts";
import { useAppDispatch } from "./app/hooks.ts";
import { useAppSelector } from "./app/hooks";
// import { AxiosInterceptor } from './app/services/request/interceptors'
import Home from "./pages/Home.tsx";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Mikanani from "./pages/Mikanani";
import News from "./pages/News";
import Logs from "./pages/Logs";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      switch (error.response.status) {
        case 401:
          alert("login expired, please sign in again!");
          dispatch(logout());
          break;
      }
      return Promise.reject(error);
    },
  );

  const { userName } = useAppSelector((state) => state.auth);

  const authCheckLoader = ({ request }: LoaderFunctionArgs) => {
    // [todo] expiration check
    if (userName === null) {
      let params = new URLSearchParams();
      params.set("from", new URL(request.url).pathname);
      return redirect("/login?" + params.toString());
    }
    return null;
  };

  const router = createBrowserRouter([
    {
      id: "home",
      path: "/",
      element: <Home />,
    },
    {
      id: "login",
      path: "login/",
      element: <Login />,
    },
    {
      id: "admin",
      path: "admin/",
      element: <Admin />,
      children: [
        {
          path: "mikanani",
          element: <Mikanani />,
        },
        {
          path: "news",
          element: <News />,
        },
        {
          path: "logs",
          element: <Logs />,
        },
      ],
      loader: authCheckLoader,
    },
  ]);

  // axios interceptor setting
  // AxiosInterceptor()

  return <RouterProvider router={router} />;
}

export default App;
