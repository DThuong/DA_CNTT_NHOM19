import React, { useEffect, useState , useRef} from "react";
import logo from "../assets/logo.png";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/userSlice";
import { showCart } from "../store/app/appSlice";

const { FaUserCircle, FaShoppingCart } = icons;

const Header = () => {
  const { current } = useSelector((state) => state.user);
  const { isShowCart } = useSelector((state) => state.app); 
  const [isShowOption, setIsShowOption] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowOption(false); // Đóng dropdown nếu click bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Lắng nghe sự kiện chuột
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Xóa sự kiện khi component bị hủy
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsShowOption(false);
  };

  const handleOpenCart = () => {
    dispatch(showCart({ signal: true }));  // Gọi action để mở giỏ hàng
  };

  return (
    <div className="w-main bg-white shadow-md">
      <div className="w-main mx-auto flex justify-between items-center h-[80px] py-[20px]">
        {/* Logo */}
        <div>
          <Link to={`/${path.HOME}`}>
            <img
              src={logo}
              alt="logo"
              className="max-h-[60px] object-contain object-top"
            />
          </Link>
        </div>

        {/* Cart and Profile */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleOpenCart}>
            <FaShoppingCart size={24} color="red" />
            <span>{`${current?.cart?.length || 0} items`}</span>
          </div>

          {/* Profile */}
          {current && (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsShowOption((prev) => !prev)}
              >
                <FaUserCircle size={24} className="text-red-500 hover:text-gray-500 transition-colors duration-300"/>
                <span className="capitalize">{current.username}</span>
              </div>

              {/* Dropdown Options */}
              {isShowOption && (
                <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-[200px] bg-white border rounded-md shadow-lg">
                  <ul className="flex flex-col">
                    {/* Admin Workspace */}
                    {+current.role === 2002 && (
                      <li>
                        <Link
                          to={`${path.ADMIN}/${path.DASHBOARD}`}
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsShowOption(false)}
                        >
                          Admin Workspace
                        </Link>
                      </li>
                    )}
                    {/* Personal */}
                    <li>
                      <Link
                        to={`${path.MEMBER}/${path.PERSONAL}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsShowOption(false)}
                      >
                        Personal
                      </Link>
                    </li>

                    {/* Logout */}
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
