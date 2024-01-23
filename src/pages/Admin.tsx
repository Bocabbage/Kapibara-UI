import { useAppDispatch } from "../app/hooks"
import { logout } from "../features/auth/authSlice"

export default function Admin() {
    const dispatch = useAppDispatch()

    return (
        <>
            <h1>Admin page!</h1>
            <button onClick={() => {dispatch(logout())}}>Logout Debug Button</button>
        </>
    )
}