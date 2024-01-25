import { useAppDispatch } from "../app/hooks"
import { logout } from "../features/auth/authSlice"

async function authHeatbeatTest() {
    // [todo] Add test
}

export default function Admin() {
    const dispatch = useAppDispatch()

    return (
        <>
            <h1>Admin page!</h1>
            <button onClick={() => {dispatch(logout())}}>Logout Debug Button</button>
            <button onClick={authHeatbeatTest}>Auth-requrired Request Debug Button</button>
        </>
    )
}