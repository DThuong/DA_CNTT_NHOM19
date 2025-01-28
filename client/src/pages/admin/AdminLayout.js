import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import path from "../../utils/path";
import { SidebarAdmin } from "../../components";

const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector(state => state.user);
  if (!isLoggedIn || !current || +current.role !== 2002)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  return <div className="flex w-full bg-red-500 min-h-screen relative text-white">
    <div className="w-[327px] fixed top-0 bottom-0 flex-none"><SidebarAdmin/></div>
    <div className="w-[327px]"></div>
    <div className="flex-auto"><Outlet /></div>
  </div>;
};

export default AdminLayout;
