// import { useState } from 'react'
import { createBrowserRouter, RouterProvider, redirect, LoaderFunctionArgs } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import { AxiosInterceptor } from './app/services/request/interceptors'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const { isLoggedIn, accessToken } = useAppSelector((state) => state.auth)

  const authCheckLoader = ({ request }: LoaderFunctionArgs) => {
      // [todo] expiration check
      if(!isLoggedIn) {
        let params = new URLSearchParams()
        params.set("from", new URL(request.url).pathname)
          return redirect("/login?" + params.toString())
      }
      return null
  }

  const router = createBrowserRouter([
    {
      id: "root",
      path: "/",
      element: <Home />,
    },
    {
      id: "login",
      path: "login/",
      element: <Login />
    },
    {
      id: "admin",
      path: "admin/",
      element: <Admin />,
      loader: authCheckLoader,
    },
  ])

  // axios interceptor setting
  AxiosInterceptor(accessToken)

  return (
    <RouterProvider router={router} />
  )
}

export default App
