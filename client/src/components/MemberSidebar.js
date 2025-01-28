import React, { useState , memo} from "react";
import avatar from "../assets/default-avatar.png"
import { memberSidebar } from "../utils/contants";
import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux"

const MemberSidebar = () => {
  const [activeParent, setActiveParent] = useState(null); // Lưu trữ trạng thái parent đang mở
    const {current} =  useSelector(state => state.user)
  // Hàm toggle submenu
  const handleToggleSubmenu = (id) => {
    setActiveParent((prev) => (prev === id ? null : id)); // Đóng/mở submenu
  };

  return (
    <div className="bg-red-400 min-h-screen w-[327px] text-white">
      {/* Header Logo */}
      <div className="flex justify-center items-center flex-col py-4 gap-2">
        <img src={current?.avatar || avatar} alt="logo" className="w-[200px] h-[200] object-cover border rounded-full" />
        <span className="font-bold text-lg">{`${current?.firstname} ${current?.lastname}`}</span>
      </div>

      {/* Sidebar Items */}
      <div className="px-4">
        {memberSidebar.map((el) => (
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
    </div>
  );
};

export default memo(MemberSidebar);
