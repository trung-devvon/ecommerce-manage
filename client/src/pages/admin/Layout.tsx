import React from "react";
import { FiUsers, FiGrid, FiBox } from "react-icons/fi";
import SidebarAdmin from "@/components/layout/Sidebar/SidebarAdmin";
import { pathAdmin } from "@/path";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppSelector } from "@/hooks/useApp";


const dataLink = [
  {
    id: 1,
    title: "Người bán",
    path: pathAdmin.ADMIN,
    icon: <FiUsers className="h-4 w-4" />,
    subLinks: [
      { id: 11, title: "Thêm mới", path: pathAdmin.CREATE_VENDORS },
      { id: 12, title: "Quản lý", path: pathAdmin.MANAGE_VENDORS },
    ],
  },
  {
    id: 2,
    title: "Người dùng",
    path: pathAdmin.MANAGE_USERS,
    icon: <FiUsers className="h-4 w-4" />,
  },
  {
    id: 3,
    title: "Danh mục",
    path: pathAdmin.ADMIN,
    icon: <FiGrid className="h-4 w-4" />,
    subLinks: [
      { id: 31, title: "Thêm mới", path: pathAdmin.CREATE_CATEGORIES },
      { id: 32, title: "Quản lý", path: pathAdmin.MANAGE_CATEGORIES },
    ],
  },
  {
    id: 4,
    title: "Sản phẩm",
    path: pathAdmin.ADMIN,
    icon: <FiBox className="h-4 w-4" />,
    subLinks: [{ id: 41, title: "Thêm mới", path: pathAdmin.MANAGE_PRODUCTS }],
  },
];

const Layout = () => {
  const { current} = useAppSelector(state => state.user)
  const navigate = useNavigate();
  console.log(current)
  if (current?.role != 'admin') {
    navigate(-1)
    return null
  }
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="w-[20%]">
        <SidebarAdmin dataLink={dataLink} parentPath="/admin" />
      </div>
      <div className="w-[80%] h-full overflow-y-auto scroll-smooth scrollbar-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
