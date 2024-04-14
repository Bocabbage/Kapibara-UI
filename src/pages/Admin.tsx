import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { KButton } from "../components/common/Button";
import { Menu, MenuProps, Avatar } from "antd";
import {
  StarOutlined,
  CoffeeOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

export default function Admin() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [currMenuKey, setCurrMenuKey] = useState("mikanani");

  useEffect(() => {
    let pathname = location.pathname;
    pathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    let pathnamesegs = pathname.split("/");
    let key = pathnamesegs[pathnamesegs.length - 1];
    if (key.toLowerCase() === "admin") navigate("mikanani");
    setCurrMenuKey(key);
  }, [location]);

  const menuItems: MenuItem[] = [
    {
      label: <NavLink to={"mikanani/"}>Mikanani</NavLink>,
      key: "mikanani",
      icon: <StarOutlined />,
    },
    {
      label: "News", // <NavLink to={"news/"}>News</NavLink>,
      key: "news",
      // TODO
      disabled: true,
      icon: <CoffeeOutlined />,
    },
    {
      label: "Logs", // <NavLink to={"logs/"}>Logs</NavLink>,
      key: "logs",
      // TODO
      disabled: true,
      icon: <DashboardOutlined />,
      children: [
        {
          label: "Mikanani Log", // <NavLink to={"mikanani/logs"}>Mikanani Log</NavLink>,
          key: "mikananiLog",
          // TODO
          disabled: true,
        },
        {
          label: "News Log", // <NavLink to={"news/logs"}>News Log</NavLink>,
          key: "newsLog",
          // TODO
          disabled: true,
        },
      ],
    },
  ];

  return (
    <>
      <title>Kapibara Admin</title>
      <div className="flex h-full w-full flex-col bg-orange-300">
        {/* Header */}
        <div className="basic-1/8 mb-1 grid grid-cols-12 bg-white">
          <div
            className="
                col-span-1 col-start-1 m-3 grid
              "
          >
            <Avatar size="large" src="/kapibara-maru.png" />
          </div>

          <div
            className="
									login-button
									col-span-1 col-start-12 flex justify-end"
          >
            <div
              className="
                login-button col-span-1
                m-3 grid"
            >
              <KButton
                text="Logout"
                onClick={() => {
                  dispatch(logout());
                }}
              />
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="basis-7/8 grid h-full grid-cols-10">
          <div className="col-span-1 grid h-full w-full">
            <Menu
              items={menuItems}
              style={{ textAlign: "left" }}
              defaultSelectedKeys={[]}
              defaultOpenKeys={["logs"]}
              mode="inline"
              selectedKeys={[currMenuKey]}
              onClick={({ key }) => setCurrMenuKey(key)}
            />
          </div>

          <div className="col-span-9 grid h-full w-full">
            {/* child-page render based on the url */}
            <Outlet />
          </div>
        </div>
      </div>
      {/* </ConfigProvider> */}
    </>
  );
}
