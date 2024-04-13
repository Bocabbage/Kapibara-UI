// import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  LoaderFunctionArgs,
} from "react-router-dom";
import { useAppSelector } from "./app/hooks";
// import { AxiosInterceptor } from './app/services/request/interceptors'
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Mikanani from "./pages/Mikanani";
import News from "./pages/News";
import "./App.css";

function App() {
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
      ],
      loader: authCheckLoader,
    },
  ]);

  // axios interceptor setting
  // AxiosInterceptor()

  return <RouterProvider router={router} />;
}

export default App;
