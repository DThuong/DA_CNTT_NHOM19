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
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    detail: product ? product : "Can't find a detail product",
  });
});
// lấy tất cả sản phẩm (filtering, sorting, pagination )
const getAllProduct = asyncHandler(async (req, res) => {
  // 2 object giống nhau là queries và req.query (copy req.query)
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((item) => delete queries[item]); // xóa các trường ra khỏi queries

  // Format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueryString = JSON.parse(queryString);

  //Filtering
  if (queries?.title)
    formatQueryString.title = { $regex: queries.title, $options: "i" };
  if (queries?.category)
    formatQueryString.category = { $regex: queries.category, $options: "i" };
  if (queries?.color) {
    formatQueryString.color = { $regex: queries.color, $options: "i" };
  }

  let queryCommand = Product.find(formatQueryString);

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join("");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fieldsLimit = req.query.fields.split(",").join("");
    queryCommand = queryCommand.select(fieldsLimit);
  }

  // Pagination
  // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS || 10;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute
  queryCommand
    .exec()
    .then(async (response) => {
      const counts = await Product.find(formatQueryString).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : "Can't find product",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    });
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
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("missing input");
  // lấy object Product thông qua id
  const ratingProduct = await Product.findById(pid);
  // Từ object Product, truy cập vào ratings property và lấy ra postedBy
  // hàm some trả về true or false / find trả về cả object
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  console.log({ alreadyRating });
  if (alreadyRating) {
    // update star & comment
    await Product.updateOne(
      // đứng ở bảng sản phẩm
      { ratings: { $elemMatch: alreadyRating } }, // tìm pid sản phẩm
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }, // hàm $set của mongoose update sp
      { new: true }
    );
  } else {
    // add star and comment
    await Product.findByIdAndUpdate(
      pid,
      // đối số muốn update
      {
        $push: { ratings: { star, comment, postedBy: _id } }, // hàm $push của mongoose push obj vào obj
      },
      { new: true }
    );
  }

  // sum ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct?.ratings?.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRating = Math.round((sumRatings * 10) / ratingCount) / 10;

  await updatedProduct.save(); // lưu vào mongodb
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
