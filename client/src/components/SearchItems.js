import React, { memo, useState } from "react";
import icons from "../utils/icons";

const SearchItems = ({
  name,
  activeClick,
  changeActiveFilter,
  type = "checkbox",
  options = [],
  onFilterChange,
}) => {
  const { IoIosArrowDown } = icons;
  const [selected, setSelected] = useState(null); // Lưu giá trị duy nhất được chọn
  
  const handleCheckboxChange = (option) => {
    const newSelected = selected === option ? null : option; // Nếu đã chọn, bỏ chọn, nếu chưa chọn thì chọn
    setSelected(newSelected);
    onFilterChange(name, newSelected ? [newSelected] : []); // Gửi dữ liệu đã chọn lên cha (chỉ một giá trị)
  };
  
  const handleReset = (e) => {
    e.stopPropagation();
    setSelected(null); // Reset khi nhấn reset
    onFilterChange(name, []); // Gửi dữ liệu trống lên cha
  };

  return (
    <div
      onClick={() => changeActiveFilter(name)}
      className="p-4 text-xs gap-6 relative border border-gray-800 flex items-center justify-between"
    >
      <span className="capitalize">{name}</span>
      <IoIosArrowDown />
      {activeClick === name && (
        <div className="absolute z-10 top-full left-0 w-fit p-4 border bg-white">
          {type === "checkbox" && (
            <div>
              <div className="w-full p-4 flex items-center justify-between gap-6">
                <span>{selected ? `${selected}` : "No selected"}</span>
                <span
                  onClick={handleReset}
                  className="underline hover:text-main cursor-pointer"
                >
                  Reset
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2">
                {options.map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={selected === option}
                      onChange={() => handleCheckboxChange(option)} // Chỉ cho phép chọn một
                      className="cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItems);
