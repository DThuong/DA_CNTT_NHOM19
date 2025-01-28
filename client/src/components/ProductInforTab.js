import React, { useState } from "react";
import { productInfor } from "../utils/contants";

const ProductInforTab = () => {
  const [activeTab, setActiveTab] = useState(1);

  const isActive = (id) => id === activeTab;

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInfor.map((el) => (
          <span
            key={el.id}
            className={`py-2 px-4 cursor-pointer ${
              isActive(el.id) ? "bg-gray-200 text-black" : "bg-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="w-full border p-4">
      {productInfor?.some(el => el.id === activeTab) && productInfor.find(el => el.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default ProductInforTab;
