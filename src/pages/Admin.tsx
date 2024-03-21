import { useAppDispatch } from "../app/hooks"
import { testAuthApi } from '../features/auth/authActions'
import { logout } from "../features/auth/authSlice"
import { Button } from "../components/Button"

export default function Admin() {
    const dispatch = useAppDispatch()

    return (
        <>
            <title>Kapibara Admin</title>
            <div className="w-full h-full flex flex-col bg-stone-50">
							<div className="basis-1/8 grid grid-cols-12 bg-zinc-300">
								<div className="
									login-button
									grid col-span-1 col-start-11 basis-1/8" 
								>
									<Button text="Logout" onClick={() => {dispatch(logout())}} />
								</div>

								<div className="
									echotest-button
									grid col-span-1 col-start-12 basis-1/8"
								>
									<Button text="Echotest" onClick={() => dispatch(testAuthApi())} />
								</div>
            	</div>
            </div>
        </>
    )
}