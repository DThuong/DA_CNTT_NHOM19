const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const data = require("../../data/data.json");
const slugify = require("slugify");
const categoryData = require("../../data/cate_brand")
const ProductCategory = require("../models/productCategory");

const fn = async (product) => {
  if (!product?.images || product.images.length === 0) return; // Bỏ qua sản phẩm không có hình ảnh
  const colorVariant = product?.variants.find((el) => el.label === "Color");
  const color = colorVariant?.variants[0] || "Default Color";
  let slug = slugify(product?.name);
  const existingProduct = await Product.findOne({ slug });

  if (existingProduct) {
    slug = `${slug}-${Date.now()}`; // Append timestamp to make it unique
  }
  await Product.create({
    title: product?.name,
    slug,
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: color,
    thumb: product?.thumb,
    totalRating: 0
  });
};
const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) promises.push(fn(product));
  await Promise.all(promises);
  return res.json("done");
});

const fn2 = async (cate) => {
  await ProductCategory.create({
    title: cate?.cate,
    brand: cate?.brand.join(','),
  });
};

const insertProductCategory = asyncHandler(async (req, res) => {
  const promises = [];
  for (let cate of categoryData) promises.push(fn2(cate));
  await Promise.all(promises);
  return res.json("done");
});

module.exports = {
  insertProduct,
  insertProductCategory,
};
