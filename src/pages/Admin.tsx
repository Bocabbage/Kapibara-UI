import { useAppDispatch } from "../app/hooks"
import { testAuthApi } from '../features/auth/authActions'
import { logout } from "../features/auth/authSlice"

export default function Admin() {
    const dispatch = useAppDispatch()

    return (
        <>
            <title>Kapibara Admin</title>
            <h1>Admin page!</h1>
            <button className="outline outline-3 outline-orange-200 login-button flex w-full justify-center rounded-md bg-orange-300 px-3 py-1.5 text-sm font-oswald-bold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => {dispatch(logout())}}>Logout Debug Button</button>
            <button className="outline outline-3 outline-orange-200 login-button flex w-full justify-center rounded-md bg-orange-300 px-3 py-1.5 text-sm font-oswald-bold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => dispatch(testAuthApi())}>Auth-requrired Request Debug Button</button>
        </>
    )
}