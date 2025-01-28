import React from "react";
import { formatNumber, renderStar } from "../utils/helpers";
import icons from "../utils/icons";
import SelectOptions from "./SelectOptions"
import { Link } from "react-router-dom";
import path from "../utils/path";

const {MdOutlineMenu,MdRemoveRedEye,FaRegHeart} = icons

const Product = ({ product }) => {
  return (
    <div className="w-full text-base px-[10px]">
      <Link className="w-full border p-[15px] flex flex-col items-center relative group" to={`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`}>
        {/* Product Image Section */}
        <div className="relative">
          <img
            src={product?.images[0] || ""}
            alt={product?.title || "Product"}
            className="w-[243px] h-[243px] object-cover"
          />
          {/* Hover Icons */}
          <div className="absolute bottom-0 right-0 left-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity animate-none">
            <SelectOptions icon={<MdRemoveRedEye />} />
            <SelectOptions icon={<MdOutlineMenu />} />
            <SelectOptions icon={<FaRegHeart />} />
          </div>
        </div>

        {/* Product Details */}
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
