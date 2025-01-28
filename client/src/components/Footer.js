import React, { memo } from "react";
import icons from "../utils/icons";

const { MdEmail } = icons;
const Footer = () => {
  return (
    <div className="w-full mt-6">
      <div className="h-[103px] w-full bg-main flex items-center justify-center">
        <div className="w-main flex items-center justify-center">
          <div className="flex flex-col flex-1">
            <span className="text-[20px] text-gray-100">
              SIGN UP TO NEWSLETTER
            </span>
            <small className="text-[13px] text-gray-300">
              Subcribe now and receive weekly newsletter
            </small>
          </div>
          <div className="flex flex-1 items-center">
            <input
              className="p-4 pr-0 rounded-l-full bg-[#f04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
              type="text"
              placeholder="Email address"
            />
            <div className="w-[56px] h-[56px] rounded-r-full bg-[#f04646] flex items-center justify-center text-white">
              <MdEmail size={16} />{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[407px] w-full bg-gray-800 flex items-center justify-center text-white text-[13px]">
        <div className="w-main flex items-center gap-8">
          <div className="flex flex-2 flex-col">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              ABOUT US
            </h3>
            <span>
              <span>Address: </span>
              <span>474 Ontario St Toronto, ON M4X 1M7 Canada</span>
            </span>
            <span>
              <span>Phone: </span>
              <span>(+1234)56789xxx</span>
            </span>
            <span>
              <span>Mail: </span>
              <span>danhthuong@gmail.com</span>
            </span>
            <span>...</span>
            <span>...</span>
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              INFORMATION
            </h3>
            <span>Typography</span>
            <span>Gallery</span>
            <span>Store Location</span>
            <span>Today's Deals</span>
            <span>Contact</span>
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              WHO WE ARE
            </h3>
            <span>Helps</span>
            <span>Free Shipping</span>
            <span>FAQs</span>
            <span>Return & Exchange</span>
            <span>Testimonials</span>
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              #DIGITALWORLDSTORE
            </h3>
            <span>...</span>
            <span>...</span>
            <span>...</span>
            <span>...</span>
            <span>...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
