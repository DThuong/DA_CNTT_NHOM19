import React, { useEffect, useState, useRef, useCallback } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { apigetProductById, apigetProduct } from "../../apis";
import { apiUpdateCart } from "../../apis";
import {
  Breadcrumb,
  Button,
  SelectQuantity,
  ProductInforTab,
  Product,
} from "../../components";
import Slider from "react-slick";
import { renderStar, formatMoney } from "../../utils/helpers";
import { toast } from "react-toastify";
import { colors } from "../../utils/contants";
import { FaAirFreshener } from "react-icons/fa";
import { useSelector } from "react-redux";
import path from "../../utils/path";
import Swal from "sweetalert2";
import { getCurrent } from "../../store/user/userasyncActions";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const DetailProduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(colors[0].name); // Set màu mặc định là màu đầu tiên trong mảng
  const [update, setupdate] = useState(false);
  const productDetailRef = useRef(null); // Tạo ref cho phần Product Detail
  const { current } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Fetch product details by ID
  const fetchProductData = async () => {
    try {
      const response = await apigetProductById(pid);
      if (response.success) {
        setProduct(response.detail);
        setActiveImage(response.detail.images?.[0] || "");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Fetch related products by category
  const fetchRelatedProducts = async () => {
    try {
      const response = await apigetProduct({ category });
      if (response.success) setRelatedProducts(response.products);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchRelatedProducts();
    }
    window.scrollTo({ top: 200, left: 200, behavior: "smooth" });
  }, [pid]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [update]);

  const rerender = useCallback(() => {
    setupdate(!update);
  }, [update]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    // console.log('clicked');
    if (!current) {
      return Swal.fire({
        title: "Almost...",
        text: "Please login first",
        icon: "info",
        cancelButtonText: "Not Now!",
        showCancelButton: true,
        confirmButtonText: "Go login Page",
      }).then(async (rs) => {
        if (rs.isConfirmed) {
          navigate(`${path.LOGIN}`);
        }
      });
    }

    // Nếu đã đăng nhập, tiếp tục xử lý thêm vào giỏ hàng
    const response = await apiUpdateCart({
      pid: product._id,
      color: color, // Màu sắc đã chọn
      quantity: quantity, // Số lượng đã chọn
    });

    if (response.success) {
      toast.success("Product added to cart successfully!");
      dispatch(getCurrent()); // Cập nhật lại giỏ hàng trong Redux
    } else {
      toast.error("An error occurred while adding to cart");
    }
  };

  // Hàm xử lý cuộn đến phần Product Detail
  const handleProductClick = () => {
    if (productDetailRef.current) {
      productDetailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Section */}
      <div className="h-[81px] bg-gray-100 flex items-center justify-center">
        <div className="w-main">
          <h3>{title || "Product Details"}</h3>
          <Breadcrumb title={title} category={category} />
        </div>
      </div>

      {/* Product Details Section */}
      <div ref={productDetailRef} className="w-main m-auto mt-4 flex gap-8">
        {/* Product Images */}
        <div className="w-2/5 flex flex-col gap-4">
          {/* Large Image Display */}
          <img
            src={activeImage || ""}
            alt="product"
            className="h-[458px] w-[458px] border object-cover"
          />
          {/* Thumbnails Slider */}
          <div className="w-[458px]">
            <Slider className="custom-slider" {...sliderSettings}>
              {product?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`sub-product-${idx}`}
                  className={`h-[143px] w-[143px] border object-cover cursor-pointer ${
                    activeImage === img ? "border-main" : "border-gray-300"
                  }`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </Slider>
          </div>
        </div>

        {/* Product Information */}
        <div className="w-2/5 flex flex-col gap-6">
          <h2 className="text-[30px] font-semibold">
            {product?.title || "Product Name"}
          </h2>
          <div className="text-[30px] font-semibold flex items-center justify-between">
            <span>{`${formatMoney(product?.price || 0)} VND`}</span>
            <span className="text-sm font-semibold">{`Stock: ${
              product?.quantity || 0
            }`}</span>
          </div>
          <div className="flex items-center gap-2">
            {renderStar(product?.totalRating)}
            <span className="ml-4">{`sold: (${
              product?.sold || 0
            } pieces)`}</span>
          </div>
          <ul className="text-sm text-gray-500 list-disc pl-4">
            {product?.description?.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>

          {/* Chọn màu */}
          <div className="flex items-center gap-2">
            <span>Choose Color:</span>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {colors.map((c, i) => (
                <option value={c.name} key={i}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn số lượng & nút Add to Cart */}
          <div className="flex flex-col gap-4">
            <SelectQuantity quantity={quantity} setQuantity={setQuantity} />
            <Button name="Add to Cart" handleOnClick={handleAddToCart} />
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="w-main mt-8 mx-auto">
        <ProductInforTab
          totalRatings={product?.totalRating}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
          rerender={rerender}
        />
      </div>

      {/* Related Products Slider */}
      <div className="w-main mt-8 mx-auto">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main border-red-500">
          OTHER CUSTOMERS ALSO LIKED
        </h3>
        <div className="w-full mt-4">
          <Slider className="custom-slider" {...sliderSettings}>
            {relatedProducts.map((relatedProduct) => (
              <Product
                key={relatedProduct._id}
                product={relatedProduct}
                onClick={handleProductClick} // Đảm bảo rằng mỗi lần click vào sản phẩm, chúng ta sẽ cuộn lên phần chi tiết
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
