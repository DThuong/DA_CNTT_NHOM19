import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "./components";
import {
  Login,
  Home,
  Public,
  Blog,
  DetailProduct,
  Products,
  FinalRegister,
  ResetPassword,
  DetailCart
} from "./pages/public";
import {
  AdminLayout,
  CreateProducts,
  ManageOrders,
  ManageProducts,
  ManageUsers,
  Dashboard,
} from "./pages/admin";
import {
  MemberLayout,
  Personal,
  History,
  MyCart,
  WishList,
} from "./pages/member";
import path from "./utils/path";
import { getCategory } from "./store/app/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Cart } from "./components";
import { showCart } from "./store/app/appSlice";
function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren, isShowCart } = useSelector(
    (state) => state.app
  );
  useEffect(() => {
    dispatch(getCategory());
  }, []);
  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      dispatch(showCart()); 
    }
  };
  return (
    <div className="font-main relative">
      {isShowCart && (
        <div onClick={() => handleCloseModal} className="absolute inset-0 bg-overlay z-50 flex justify-end">
          <Cart />
        </div>
      )}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        {/* Main public route */}
        <Route path={path.PUBLIC} element={<Public />}>
          {/* Nested route */}
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route
            path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE}
            element={<DetailProduct />}
          />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.ALL} element={<NotFound />}></Route>
          <Route path="/404" element={<NotFound />} />
        </Route>
        {/* Admin public route */}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />}></Route>
          <Route
            path={path.CREATE_PRODUCT}
            element={<CreateProducts />}
          ></Route>
          <Route path={path.MANAGE_ORDER} element={<ManageOrders />}></Route>
          <Route
            path={path.MANAGE_PRODUCT}
            element={<ManageProducts />}
          ></Route>
          <Route path={path.MANAGE_USER} element={<ManageUsers />}></Route>
        </Route>
        {/* member route */}
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />}></Route>
          <Route path={path.HISTORY} element={<History />}></Route>
          <Route path={path.MY_CART} element={<MyCart />}></Route>
          <Route path={path.WISH_LIST} element={<WishList />}></Route>
        </Route>
        {/* Login route and register route */}
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
}

export default App;
