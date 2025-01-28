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
} from "./pages/public";
import {AdminLayout, CreateProducts, ManageOrders, ManageProducts, ManageUsers, Dashboard} from "./pages/admin";
import {MemberLayout, Personal, History, MyCart, WishList} from "./pages/member";
import path from "./utils/path";
import { getCategory } from "./store/app/asyncActions";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategory());
  }, []);
  return (
    <div className="min-h-screen font-main">
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
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.ALL} element={<NotFound />}></Route>
          <Route path="/404" element={<NotFound />} />
        </Route>
        {/* Admin public route */}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />}></Route>
          <Route path={path.CREATE_PRODUCT} element={<CreateProducts />}></Route>
          <Route path={path.MANAGE_ORDER} element={<ManageOrders />}></Route>
          <Route path={path.MANAGE_PRODUCT} element={<ManageProducts />}></Route>
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
