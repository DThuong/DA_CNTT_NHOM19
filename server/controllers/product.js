const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const slugify = require("slugify");

// Tạo 1 sản phẩm mới
const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("missing input");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const NewProduct = await Product.create(req.body);
  return res.status(200).json({
    success: NewProduct ? true : false,
    newProduct: NewProduct ? NewProduct : "Failed to create product",
  });
});

// lấy chi tiết 1 sản phẩm
const detailProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate(
    {
      path: 'ratings',
      populate: {
        path: 'postedBy',
        select: 'firstname lastname avatar'
      }
    }
  );
  return res.status(200).json({
    success: product ? true : false,
    detail: product ? product : "Can't find a detail product",
  });
});
// lấy tất cả sản phẩm (filtering, sorting, pagination )
const getAllProduct = asyncHandler(async (req, res) => {
  // Copy các query params từ req.query
  const queries = { ...req.query };

  // Lấy các trường không muốn đưa vào query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((item) => delete queries[item]); // Xóa các trường như limit, sort, page, fields

  // Format lại các operator như gte, gt, lte cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueryString = JSON.parse(queryString);

  // Filtering
  if (queries?.title) {
    formatQueryString.title = { $regex: queries.title, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
  }
  if (queries?.category) {
    formatQueryString.category = { $regex: queries.category, $options: "i" };
  }
  if (queries?.color) {
    formatQueryString.color = { $regex: queries.color, $options: "i" };
  }

  // Lệnh tìm kiếm cơ bản với populate cho ratings và postedBy
  let queryCommand = Product.find(formatQueryString)
    .populate({
      path: 'ratings',
      populate: {
        path: 'postedBy',
        select: 'firstName lastName avatar', // Chọn các trường cần thiết của user
      },
    });

  // Sorting (Sắp xếp)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy); // Sắp xếp theo các trường được chỉ định
  }

  // Limiting fields (Giới hạn các trường)
  if (req.query.fields) {
    const fieldsLimit = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fieldsLimit); // Chỉ lấy các trường cần thiết
  }

  // Pagination (Phân trang)
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS || 10;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // Thực thi câu truy vấn
  try {
    const products = await queryCommand.exec();

    // Đếm tổng số sản phẩm
    const counts = await Product.find(formatQueryString).countDocuments();

    return res.status(200).json({
      success: true,
      counts,
      products: products.length > 0 ? products : "Can't find product",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Cập nhật sản phẩm
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updatedProduct: updateProduct
      ? updateProduct
      : "Failed to update a detail product",
  });
});
// Xóa sản phẩm
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleted = await Product.findByIdAndDelete(pid);
  res.status(200).json({
    success: deleteProduct ? true : false,
    deletedProduct: deleted
      ? "Deleted product success"
      : "Failed to delete product",
  });
});

// ratings
const ratingProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
  if (!star || !pid) throw new Error("missing input");

  // Lấy object Product thông qua id
  const ratingProduct = await Product.findById(pid);
  // Từ object Product, truy cập vào ratings property và tìm đánh giá của người dùng
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );

  if (alreadyRating) {
    // Nếu đã có đánh giá, chỉ cần cập nhật lại bình luận và sao
    await Product.updateOne(
      { ratings: { $elemMatch: alreadyRating } }, // tìm pid sản phẩm và rating của user
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      { new: true }
    );
  } else {
    // Nếu chưa có đánh giá, thêm bình luận và sao mới vào mảng ratings
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
      },
      { new: true }
    );
  }

  // Cập nhật tổng số điểm đánh giá
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct?.ratings?.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRating = Math.round((sumRatings * 10) / ratingCount) / 10;

  await updatedProduct.save(); // Lưu vào MongoDB
  return res.status(200).json({ status: true, updatedProduct });
});


const uploadImageProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing files");
  const response = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot put file into cloud storage",
  });
});

module.exports = {
  createProduct,
  detailProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  ratingProduct,
  uploadImageProduct,
};
