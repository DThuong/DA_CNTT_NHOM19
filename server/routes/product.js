const express = require("express")
const router = express.Router()
const productCltrs = require("../controllers/product")
const {isAdmin, verifyAccessToken} = require("../middlewares/verifyToken")
const uploader = require("../config/cloudinary.config")

router.post("/", [verifyAccessToken, isAdmin], productCltrs.createProduct)
router.get("/", productCltrs.getAllProduct)
router.put("/upload/:pid", [verifyAccessToken, isAdmin], uploader.array('images', 10), productCltrs.uploadImageProduct)
router.put("/ratings", [verifyAccessToken], productCltrs.ratingProduct)
router.put("/:pid", [verifyAccessToken, isAdmin], productCltrs.updateProduct)
router.delete("/:pid",[verifyAccessToken, isAdmin], productCltrs.deleteProduct)
router.get("/:pid", productCltrs.detailProduct)

module.exports = router