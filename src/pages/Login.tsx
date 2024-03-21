import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { userLogin, LoginParamsForm } from '../features/auth/authActions'
import { useNavigate } from 'react-router-dom'
// import { isAllOf } from '@reduxjs/toolkit'
import { Switch, ConfigProvider } from 'antd'

export default function Login() {
    // [todo] use error data
    const { userName, loading } = useAppSelector((state) => state.auth)
    const navigate = useNavigate()
    
    const [rememberMe, setRememberMe] = useState(false)
    const changeRememberMe = () => {
      setRememberMe(!rememberMe);
    }


    // Redirect if logged-in
    useEffect(() => {
        if(userName !== null) {
            // [todo] enhancement
            navigate("/Admin")
        }
    }, [userName])

    const dispatch = useAppDispatch()
    
    const { register, handleSubmit } = useForm()

    const submitForm = (data: any) => {
        let formData = data as LoginParamsForm
        formData.rememberMe = rememberMe
        // dispatch function can accept the thunk object as parameter directly
        dispatch(userLogin(formData))
    }

    return (
        // [todo]
        // 1. Use Kapibara-icon picture
        // 2. Handle token-expired
        <>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#9dbdba'
            }
          }}
        >
        <title>Kapibara Login</title>
        <div className="w-1/2 bg-stone-50 flex min-w-full min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto max-w-xl">
            {/* <img
                className="mx-auto h-48 w-auto"
                src="/kapibara-maru.png"
            /> */}
            <h2 className="mt-10 text-center pb-6 text-5xl font-bold leading-9 tracking-tight text-gray-900">
                Kapibara System
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="block font-bold text-lg leading-6 text-gray-900">
                    Account
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="account"
                    type="text"
                    {...register('account')}
                    required
                    className="form-input block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block font-bold text-lg leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    autoComplete="current-password"
                    required
                    className="form-input block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex flex-row space-x-2 justify-end">
                <p>Remember Me</p>
                <div>
                <Switch 
                    checked={rememberMe} 
                    onClick={changeRememberMe} 
                    className="bg-stone-200"
                />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="outline outline-2 font-bold login-button flex w-full justify-center rounded-lg bg-zinc-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
        </ConfigProvider>
        </>
    )
}