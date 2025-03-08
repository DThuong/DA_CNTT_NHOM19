import React, { useState, memo } from "react";
import { AiFillCloseCircle, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { showCart, showModal } from "../store/app/appSlice";
import { apiDeleteCart, apiUpdateCart } from "../apis";
import { getCurrent } from "../store/user/userasyncActions";
import { toast } from "react-toastify";
import path from "../utils/path";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);

  const handleCloseCart = () => {
    dispatch(showCart({ signal: false })); // Dispatch action để ẩn giỏ hàng
  };

  const RemoveCart = async (data) => {
    const res = await apiDeleteCart(data);
    if (res.success) {
      dispatch(getCurrent()); // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
    } else {
      toast.error(res.msg);
    }
  };

  const updateQuantity = async (productId, quantity, color) => {
    const res = await apiUpdateCart({ pid: productId, quantity, color });
    if (res.success) {
      dispatch(getCurrent()); // Cập nhật lại giỏ hàng sau khi thay đổi
    } else {
      toast.error(res.msg);
    }
  };

  const calculateTotal = () => {
    return current?.cart?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[600px] max-h-screen overflow-y-auto bg-black text-white p-6"
    >
      <header className="p-4 border-b font-bold text-2xl border-gray-800 flex items-center justify-between">
        <span>Your Cart</span>
        <span className="cursor-pointer p-2" onClick={handleCloseCart}>
          <AiFillCloseCircle size={24} />
        </span>
      </header>

      {/* Danh sách sản phẩm trong giỏ hàng */}
      <section className="mt-4">
        {!current?.cart?.length && (
          <span className="text-xs italic text-center block">Your cart is empty</span>
        )}
        {current?.cart?.map((el) => (
          <div key={el._id} className="flex gap-4 items-center border-b border-gray-800 py-4">
            <img
              src={el.product?.thumb}
              alt={el.product?.title}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4 className="text-lg font-semibold">Name: {el.product?.title}</h4>
              <p className="text-sm text-gray-400">Price: {el.product?.price}</p>
              <p className="text-sm text-gray-400">Color: {el?.color}</p>
              <p className="text-sm text-gray-400">Quantity: </p>
              
              {/* Input thay đổi số lượng */}
              <div className="flex items-center space-x-2 mt-1">
                <button
                  onClick={() => updateQuantity(el.product?._id, el.quantity - 1, el.color)} // Cập nhật giảm số lượng
                  className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                  disabled={el.quantity <= 1}
                >
                  -
                </button>
                <span className="font-semibold">{el.quantity}</span>
                <button
                  onClick={() => updateQuantity(el.product?._id, el.quantity + 1, el.color)} // Cập nhật tăng số lượng
                  className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right text-lg font-semibold">
              {new Intl.NumberFormat().format((el.product?.price * el.quantity).toFixed(0))} VND
            </div>
            
            <div
              className="cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => RemoveCart(el.product?._id)} // Xử lý sự kiện xóa sản phẩm
            >
              <AiOutlineDelete size={24} />
            </div>
          </div>
        ))}
      </section>

      {/* Tổng tiền */}
      <div className="mt-4 border-t border-gray-800 pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>{new Intl.NumberFormat().format(calculateTotal().toFixed(0))} VND</span>
        </div>
      </div>

      {/* Nút Checkout */}
      <div className="mt-6">
        <button
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {
            dispatch(showCart())
            navigate(`${path.DETAIL_CART}`)
          }
          }
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default memo(Cart);
