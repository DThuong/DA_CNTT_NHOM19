import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { Breadcrumb } from "../../components";
import { apigetProduct } from "../../apis";
import { Product, SearchItems } from "../../components";
import Masonry from "react-masonry-css";
import { colors } from "../../utils/contants";
import { InputSelect } from "../../components";
import { sorts } from "../../utils/contants";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const validCategories = [
  "smartphone",
  "tablet",
  "laptop",
  "accessories",
  "television",
  "printer",
  "speaker",
  "camera",
  ":category",
];

const Products = () => {
  const { category } = useParams();
  const [products, setproducts] = useState(null);
  const [sort, setSort] = useState("");
  const [activeClick, setActiveClick] = useState(null);
  const [filters, setFilters] = useState({ colors: [] });
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams(); // Sử dụng useSearchParams để lấy các tham số query hiện tại
  const readableCategory = category?.split("-").join("") || "Product List";

  const fetchProductByCategory = async (queries) => {
    const res = await apigetProduct({ ...queries, category: readableCategory });
    if (res.success) {
      setproducts(res.products);
    }
  };

  // Sử dụng useEffect để lấy tham số từ URL và gọi API
  useEffect(() => {
    if (!validCategories.includes(readableCategory)) {
      // Nếu không hợp lệ, điều hướng tới trang NotFound
      navigate("/404", { replace: true });
      return; // Thoát khỏi useEffect
    }
    const queries = {};

    // Lấy các tham số hiện tại từ URL (search params)
    for (let [key, value] of params.entries()) {
      queries[key] = value;
    }

    // Gọi API với các query hiện tại
    fetchProductByCategory(queries);
  }, [params]); // Khi params thay đổi, gọi lại API

  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );

  const handleFilterChange = (name, selectedOptions) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name.toLowerCase()]: selectedOptions };
  
      // Tạo URLSearchParams, giữ lại các tham số cũ, và thêm bộ lọc mới
      const newParams = new URLSearchParams(params);
  
      if (selectedOptions.length > 0) {
        newParams.set("color", selectedOptions.join(","));
      } else {
        newParams.delete("color"); // Nếu không có bộ lọc, xóa tham số này
      }
  
      // Cập nhật URL
      navigate({
        pathname: `/${readableCategory}`,
        search: newParams.toString(),
      });
  
      return updatedFilters;
    });
  };
  
  
  const changeValue = useCallback(
    (e) => {
      setSort(e);
    },
    [sort]
  );

  useEffect(() => {
    // Tạo đối tượng queries kết hợp từ các params hiện tại và filters
    const queries = { ...params, ...filters, sort };
  
    // Gọi API với các tham số (cả filter và sort)
    fetchProductByCategory(queries);
  
    // Cập nhật URL với các tham số mới (filter + sort)
    navigate({
      pathname: `/${readableCategory}`,
      search: createSearchParams(queries).toString(),
    });
  }, [filters, sort, params, readableCategory, navigate]);  // Đảm bảo là có cả filters và sort trong phụ thuộc
  
  


  return (
    <div className="w-full">
      <div className="h-[81px] bg-gray-100 flex items-center justify-center">
        <div className="w-main">
          <h3>
            {readableCategory.includes(":category")
              ? "Products"
              : readableCategory}
          </h3>
          <Breadcrumb
            category={
              readableCategory.includes(":category")
                ? "Products"
                : readableCategory
            }
          />
        </div>
      </div>
      <div className="w-main border p-4 flex justify-between mt-8 m-auto">
        <div className="w-4/5 flex-auto flex items-start gap-4 flex-col">
          <span className="font-semibold text-sm">Filter By</span>
          <div className="flex items-center gap-4">
            <SearchItems
              name="Color"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              options={colors.map((el) => el.name)}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="w-1/5 flex flex-col gap-3">
          <span className="text-sm font-semibold">Sort By</span>
          <div className="w-full">
            <InputSelect
              value={sort}
              option={sorts}
              changevalue={changeValue}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 w-main m-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {products?.map((el) => (
            <div key={el._id}>
              <Product product={el} />
            </div>
          ))}
        </Masonry>
      </div>
      <div className="w-full h-[500px]"></div>
    </div>
  );
};

export default Products;
