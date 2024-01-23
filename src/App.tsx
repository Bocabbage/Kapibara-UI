// import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const { isLoggedIn } = useAppSelector((state) => state.auth)
  console.log(isLoggedIn)

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
      // [todo] check status change situation
      element: isLoggedIn ? <Admin /> : <Login />,
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
