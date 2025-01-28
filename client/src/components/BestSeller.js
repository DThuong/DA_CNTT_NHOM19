import React, { useEffect, useState } from "react";
import { apigetProduct } from "../apis";
import Product from "./Product";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "Best Sellers" },
  { id: 2, name: "New Arrivals" },
];

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const BestSeller = () => {
  const [bestSeller, setbestSeller] = useState(null);
  const [newProducts, setnewProducts] = useState(null);
  const [activedtab, setactivedtab] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Promise.all([
          apigetProduct({ sort: "-sold" }),
          apigetProduct({ sort: "-createdAt" }),
        ]);
        if (response[0].success) setbestSeller(response[0].products);
        if (response[1].success) setnewProducts(response[1].products);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error.response?.data || error.message
        );
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-bold capitalized border-r cursor-pointer ${
              activedtab === el.id ? "text-main" : ""
            }`}
            onClick={() => setactivedtab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>

      <div className="mt-4 mx-[-10px]">
        <Slider {...settings}>
          {(activedtab === 1 ? bestSeller : newProducts)?.map((el) => (
            <Product key={el.id} product={el} />
          ))}
        </Slider>
      </div>

      <div className="w-full flex gap-4 mt-8">
        <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657" alt="banner" className="flex-1 object-contain" />
        <img src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657" alt="banner" className="flex-1 object-contain" />
      </div>
    </div>
  );
};

export default BestSeller;
