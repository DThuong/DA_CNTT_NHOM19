import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { showCart } from "../../store/app/appSlice";
import { apiDeleteCart, apiUpdateCart } from "../../apis";
import { getCurrent } from "../../store/user/userasyncActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";

const DetailCart = ({ location }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);

  const handleCloseCart = () => {
    dispatch(showCart({ signal: false })); // Dispatch action to close the cart
  };

  const RemoveCart = async (productId) => {
    const res = await apiDeleteCart(productId);
    if (res.success) {
      dispatch(getCurrent()); // Update the cart after deletion
    } else {
      toast.error(res.msg);
    }
  };

  const updateQuantity = async (productId, quantity, color) => {
    const res = await apiUpdateCart({ pid: productId, quantity, color });
    if (res.success) {
      dispatch(getCurrent()); // Update the cart after quantity change
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
    <div className="w-full">
      <div className="h-[81px] bg-gray-100 flex items-center justify-center">
        <div className="w-main">
          <h3 className="font-semibold uppercase">My Cart</h3>
        </div>
      </div>

      {/* Cart Table */}
      <div className="mt-6 w-main mx-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {current?.cart?.map((el) => (
              <tr key={el._id}>
                <td className="border p-2 flex items-center">
                  <img
                    src={el.product?.thumb}
                    alt={el.product?.title}
                    className="w-12 h-12 object-cover mr-2"
                  />
                  <span>{el.product?.title}</span>
                  <span className="ml-2 text-gray-500">{el.product?.color}</span>
                </td>
                <td className="border p-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(el.product?._id, el.quantity - 1, el.color)} // Decrease quantity
                      className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                      disabled={el.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold">{el.quantity}</span>
                    <button
                      onClick={() => updateQuantity(el.product?._id, el.quantity + 1, el.color)} // Increase quantity
                      className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border p-2">{new Intl.NumberFormat().format((el.product?.price * el.quantity).toFixed(0))} VND</td>
                <td className="border p-2">
                  <div
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => RemoveCart(el.product?._id)} // Delete product
                  >
                    <AiOutlineDelete size={24} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="mt-4 border-t pt-4 pr-[230px]">
        <div className="flex justify-end text-lg font-semibold gap-16">
          <div className="flex items-center gap-4">
            <span>Total:</span>
            <span>{new Intl.NumberFormat().format(calculateTotal().toFixed(0))} VND</span>
          </div>
          {/* Checkout Button */}
          <div>
            <button
              className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                dispatch(showCart());
                navigate(`${path.DETAIL_CART}`);
              }}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCart;
