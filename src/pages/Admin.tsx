import { useAppDispatch } from "../app/hooks"
import { testAuthApi } from '../features/auth/authActions'
import { logout } from "../features/auth/authSlice"
import { KButton } from "../components/common/Button"
import { Menu, MenuProps, ConfigProvider } from "antd"
import { StarOutlined, CoffeeOutlined } from "@ant-design/icons"
import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"

type MenuItem = Required<MenuProps>['items'][number]

export default function Admin() {
    const dispatch = useAppDispatch()
		const location = useLocation()
		const navigate = useNavigate()
		const [currMenuKey, setCurrMenuKey] = useState("mikanani")

		useEffect(() => {
			let pathname = location.pathname
			pathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
			let pathnamesegs = pathname.split('/')
			let key = pathnamesegs[pathnamesegs.length - 1]
			if(key.toLowerCase() === 'admin')
				navigate("admin/mikanani")
			setCurrMenuKey(key)
		}, [location])

		const menuItems: MenuItem[] = [
			{
				label: <NavLink to={"mikanani/"}>Mikanani</NavLink>, 
				key: "mikanani", 
				icon: <StarOutlined />
			},
			{
				label: <NavLink to={"beans/"}>Beans</NavLink>, 
				key: "beans", 
				icon: <CoffeeOutlined />
			},
		]

    return (
        <>
						<ConfigProvider
							theme={{
                token: {
                  
                },
								components: {
									Menu: {
										itemSelectedBg: "#52525b",
										itemSelectedColor: "#ffffff",
										itemBorderRadius: 4,
										itemMarginInline:8,
									},
                  Switch: {
                    // handleBg: "#e7e5e4"
                  }
								}
							}}
						>
            <title>Kapibara Admin</title>
            <div className="w-full h-full flex flex-col bg-stone-50">
							{/* Header */}
							<div className="basic-1/8 grid grid-cols-12 bg-zinc-300">
								<div className="
									echotest-button
									grid col-span-1 col-start-11 basis-1/8"
								>
									<KButton text="Echotest" onClick={() => dispatch(testAuthApi())} />
								</div>

								<div className="
									login-button
									grid col-span-1 col-start-12 basis-1/8" 
								>
									<KButton text="Logout" onClick={() => {dispatch(logout())}} />
								</div>
            	</div>
							{/* Body */}
							<div className="basis-7/8 grid grid-cols-12 h-full">
								<div className="grid col-span-2 w-full h-full">
									<Menu 
										items={menuItems} 
										defaultSelectedKeys={[]}
										selectedKeys={[currMenuKey]}
										onClick={({key}) => setCurrMenuKey(key)}
									/>
								</div>

								<div className="grid col-span-10 w-full h-full">
									{/* child-page render based on the url */}
									<Outlet />
								</div>

							</div>
            </div>
						</ConfigProvider>
        </>
    )
}