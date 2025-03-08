import React, { useState } from "react";
import logo from "../assets/logo.png";
import { adminSidebar } from "../utils/contants";
import { NavLink } from "react-router-dom";
import path from "../utils/path";

const SidebarAdmin = () => {
  const [activeParent, setActiveParent] = useState(null); // Lưu trữ trạng thái parent đang mở

  // Hàm toggle submenu
  const handleToggleSubmenu = (id) => {
    setActiveParent((prev) => (prev === id ? null : id)); // Đóng/mở submenu
  };

  return (
    <div className="bg-red-400 h-full text-white">
      {/* Header Logo */}
      <div className="flex justify-center items-center flex-col py-4 gap-2">
        <img src={logo} alt="logo" className="w-[200px] object-contain" />
        <span className="font-bold text-lg">Admin Workspace</span>
      </div>

      {/* Sidebar Items */}
      <div className="px-4">
        {adminSidebar.map((el) => (
          <div key={el.id} className="mb-4">
            {/* Single Item */}
            {el.type === "single" && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-md ${
                    isActive ? "bg-red-600" : "hover:bg-red-500"
                  }`
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}

            {/* Parent Item */}
            {el.type === "parent" && (
              <div>
                {/* Parent Header */}
                <div
                  onClick={() => handleToggleSubmenu(el.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-red-500"
                >
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                </div>

                {/* Submenu */}
                {activeParent === el.id && (
                  <div className="ml-6 mt-2">
                    {el.submenu.map((sub, index) => (
                      <NavLink
                        key={index}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-4 py-2 rounded-md ${
                            isActive ? "bg-red-600" : "hover:bg-red-500"
                          }`
                        }
                      >
                        {sub.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back to homepage link */}
      <NavLink
        to={path.PUBLIC} // Sử dụng path.HOME để chuyển hướng về trang chủ
        className="block px-4 py-2 mt-4 text-center text-white hover:underline rounded-md"
      >
        Back to homepage
      </NavLink>
    </div>
  );
};

export default SidebarAdmin;
