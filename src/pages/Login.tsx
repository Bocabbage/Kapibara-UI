import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { userLogin, LoginParamsForm } from '../features/auth/authActions'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    // [todo] use error data
    const { isLoggedIn, loading, error } = useAppSelector((state) => state.auth)
    const navigate = useNavigate()

    // Redirect if logged-in
    useEffect(() => {
        if(isLoggedIn) {
            // [todo] enhancement
            navigate("/Admin")
        }
    }, [isLoggedIn])

    const dispatch = useAppDispatch()
    
    const { register, handleSubmit } = useForm()

    const submitForm = (data: any) => {
        let formData = data as LoginParamsForm
        // dispatch function can accept the thunk object as parameter directly
        dispatch(userLogin(formData))
    }

    return (
        <>
            <h1>Login page! {error}</h1>
            <form onSubmit={handleSubmit(submitForm)}>
                <div className='login-form-group'>
                    <label htmlFor='account'>Account</label>
                    <input
                        type='text'
                        className='form-input'
                        {...register('account')}
                        required
                    />
                </div>
                <div className='login-form-group'>
                    <label htmlFor='password'>password</label>
                    <input
                        type='password'
                        className='form-input'
                        {...register('password')}
                        required
                    />
                </div>
                <button type='submit' className='login-button' disabled={loading}>
                    Login
                </button>
            </form>
        </>
    )
}