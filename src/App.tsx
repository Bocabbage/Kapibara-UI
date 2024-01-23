// import { useState } from 'react'
import { createBrowserRouter, redirect, LoaderFunctionArgs, RouterProvider } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import './App.css'

function authProtectedLoader({ request }: LoaderFunctionArgs) {
  // Invalid use: can only be used in a component
  const { accessToken } = useAppSelector((state) => state.auth)
  // [todo] set expired
  if(!accessToken) {
      let params = new URLSearchParams();
      params.set("from", new URL(request.url).pathname);
      return redirect("login?" + params.toString());
  }

  return null;
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
    loader: authProtectedLoader,
  },
])

function App() {
  const { isLoggedIn } = useAppSelector((state) => state.auth)

  return (
    <RouterProvider router={router} />
  )
}

export default App
