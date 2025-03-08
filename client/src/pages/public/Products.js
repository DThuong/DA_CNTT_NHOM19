import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../components";
import { apigetProduct } from "../../apis";
import { Product, SearchItems } from "../../components";
import Masonry from "react-masonry-css";
import { colors, sorts } from "../../utils/contants";
import { InputSelect } from "../../components";

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
];

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]); // Khởi tạo với mảng rỗng
  const [sort, setSort] = useState(""); // Sắp xếp
  const [activeClick, setActiveClick] = useState(null); // Bộ lọc
  const [filters, setFilters] = useState({ colors: [] }); // Lọc theo màu sắc
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const readableCategory = category?.split("-").join("") || "Product List";

  // Fetch products by category and query params
  const fetchProductByCategory = async (queries) => {
    const limit = queries.limit || 50; // Set a default limit

    try {
      const res = await apigetProduct({ ...queries, category: readableCategory, limit });

      if (res.success && Array.isArray(res.products)) {
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Fetch data on mount or when query params change
  useEffect(() => {
    if (!validCategories.includes(readableCategory)) {
      navigate("/404", { replace: true });
      return;
    }

    const queries = {};
    for (let [key, value] of params.entries()) {
      queries[key] = value;
    }

    fetchProductByCategory(queries);
  }, [params, readableCategory, navigate]);

  // Toggle active filter
  const changeActiveFilter = useCallback(
    (name) => {
      setActiveClick(activeClick === name ? null : name);
    },
    [activeClick]
  );

  // Handle filter change (e.g., colors)
  const handleFilterChange = (name, selectedOptions) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name.toLowerCase()]: selectedOptions };

      const newParams = new URLSearchParams(params);
      if (selectedOptions.length > 0) {
        newParams.set("color", selectedOptions.join(","));
      } else {
        newParams.delete("color");
      }

      navigate({
        pathname: `/${readableCategory}`,
        search: newParams.toString(),
      });

      return updatedFilters;
    });
  };

  // Handle sorting
  const changeValue = useCallback(
    (e) => {
      setSort(e);  // Cập nhật giá trị sort trong state
    },
    [sort]
  );

  // Fetch data and update URL when filters or sort change
  useEffect(() => {
    const queries = { ...params, ...filters, sort };
    fetchProductByCategory(queries);

    // Update the URL with new query params
    navigate({
      pathname: `/${readableCategory}`,
      search: createSearchParams(queries).toString(),
    });
  }, [filters, sort, params, readableCategory, navigate]);

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    const newParams = new URLSearchParams(params);
    newParams.set("limit", newLimit);  // Update limit in query parameters

    navigate({
      pathname: `/${readableCategory}`,
      search: newParams.toString(),
    });
  };

  return (
    <div className="w-full">
      <div className="h-[81px] bg-gray-100 flex items-center justify-center">
        <div className="w-main">
          <h3>{readableCategory === "Product List" ? "Products" : readableCategory}</h3>
          <Breadcrumb
            category={readableCategory === "Product List" ? "Products" : readableCategory}
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
          {Array.isArray(products) && products.length > 0 ? (
            products.map((el) => (
              <div key={el._id}>
                <Product product={el} />
              </div>
            ))
          ) : (
            <div className="text-center">No products available</div>
          )}
        </Masonry>
      </div>
      <div className="w-full h-[500px]"></div>
    </div>
  );
};

export default Products;
