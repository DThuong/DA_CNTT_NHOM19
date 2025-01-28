import React, { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import path from "../utils/path";
import { getCurrent } from "../store/user/userasyncActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "../utils/icons";
import { logout } from "../store/user/userSlice";
const TopHeader = () => {
  const { TbLogout } = icons;
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLoggedIn && !current) dispatch(getCurrent());
  }, [dispatch, isLoggedIn, current]);
  return (
    <div className="h-[38px] w-full bg-main flex items-center justify-center">
      <div className="w-main flex items-center justify-end text-xs text-white">
        {isLoggedIn && current ? (
          <div className="flex items-center text-sm gap-4">
            <span>{`Xin chào ${current?.firstname} ${current?.lastname}`}</span>
            <span
              onClick={() => dispatch(logout())}
              className="hover:rounded-full hover:bg-gray-500 hover:text-main p-2 cursor-pointer"
            >
              <TbLogout size={18} />
            </span>
          </div>
        ) : (
          <Link to={`${path.LOGIN}`} className="hover:text-gray-800">
            Sign In or create account
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);
