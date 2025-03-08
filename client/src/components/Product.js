import React, { useState, useEffect } from "react";
import { formatNumber, renderStar } from "../utils/helpers";
import icons from "../utils/icons";
import SelectOptions from "./SelectOptions";
import { Link } from "react-router-dom";
import { apiUpdateCart } from "../apis/user";
import { getCurrent } from "../store/user/userasyncActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import path from "../utils/path";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const { FaShoppingCart, MdRemoveRedEye, FaRegHeart } = icons;

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const itemInCart = cartItems?.some((item) => item?._id === product?._id);
    setIsInCart(itemInCart); // Nếu có thì đặt là true
  }, [product?._id]);

  const handleClickOptions = async (e, option) => {
    e.preventDefault();
    e.stopPropagation();

    switch (option) {
      case "CART":
        if (!current) {
          return Swal.fire({
            title: "Almost...",
            text: "Please login first",
            icon: "info",
            cancelButtonText: "Not Now!",
            showCancelButton: true,
            confirmButtonText: "Go login Page",
          }).then((rs) => {
            if (rs.isConfirmed) navigate(`${path.LOGIN}`);
          });
        }

        // Handle add to cart
        const response = await apiUpdateCart({
          pid: product._id,
          color: product.color,
        });
        if (response.success) {
          toast.success("Product added to cart successfully!");
          // Cập nhật trạng thái giỏ hàng
          setIsInCart(true); // Đặt là true sau khi thêm vào giỏ hàng
          // Lưu giỏ hàng vào localStorage
          const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
          cartItems.push(product);
          localStorage.setItem("cart", JSON.stringify(cartItems));
          dispatch(getCurrent()); // Cập nhật thông tin người dùng sau khi thêm vào giỏ
        } else {
          toast.error("An error occurred while adding to cart");
        }
        break;
      case "WISHLIST":
        console.log("Added to wishlist:", product?.title);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full text-base px-[10px]">
      <Link
        className="w-full border p-[15px] flex flex-col items-center relative group"
        to={`/${product?.category?.toLowerCase()}/${product?._id}/${
          product?.title
        }`}
      >
        <div className="relative">
          <img
            src={product?.images[0] || ""}
            alt={product?.title || "Product"}
            className="w-[243px] h-[243px] object-cover"
          />
          <div className="absolute bottom-0 right-0 left-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity animate-none">
            <span
              title="Quick View"
              onClick={(e) => handleClickOptions(e, "QUICK_VIEW")}
            >
              <SelectOptions icon={<MdRemoveRedEye />} />
            </span>
            <span
              title="Add To Cart"
              onClick={(e) => handleClickOptions(e, "CART")}
              className="cursor-pointer text-red-500 hover:text-red-700"
            >
              <SelectOptions icon={<FaShoppingCart />} />
            </span>
            <span
              title="Add To Wishlist"
              onClick={(e) => handleClickOptions(e, "WISHLIST")}
            >
              <SelectOptions icon={<FaRegHeart />} />
            </span>
          </div>
        </div>

        <div className="flex flex-col mt-[15px] items-start gap-2 w-full">
          <span className="flex">{renderStar(product?.totalRating)}</span>
          <span className="line-clamp-1">{product?.title}</span>
          <span>{`${formatNumber(product?.price)} VND`}</span>
        </div>
      </Link>
    </div>
  );
};

export default Product;
