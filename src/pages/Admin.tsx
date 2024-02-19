import axios from 'axios'
import { useAppDispatch } from "../app/hooks"
import { logout } from "../features/auth/authSlice"
import { APISERVER_URL } from '../configs/remote'

async function authHeatbeatTest() {
    // [todo] Add test
    const data = await axios.get(
        `${APISERVER_URL}/test/v1/echo`, {
        params: {
            message: "hello",
        },
    })
    console.log(data)
}

export default function Admin() {
    const dispatch = useAppDispatch()

    return (
        <>
            <title>Kapibara Admin</title>
            <h1>Admin page!</h1>
            <button onClick={() => {dispatch(logout())}}>Logout Debug Button</button>
            <button onClick={authHeatbeatTest}>Auth-requrired Request Debug Button</button>
        </>
    )
}