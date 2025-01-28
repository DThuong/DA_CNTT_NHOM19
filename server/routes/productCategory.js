const express = require("express")
const router = express.Router()
const productCategoryCltrs = require("../controllers/productCategory")
const {isAdmin, verifyAccessToken} = require("../middlewares/verifyToken")

router.get('/', productCategoryCltrs.getAllProductCategory)
router.post('/', [verifyAccessToken, isAdmin], productCategoryCltrs.createProductCategory)
router.put('/:pcid', [verifyAccessToken, isAdmin], productCategoryCltrs.updateProductCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], productCategoryCltrs.deleteProductCategory)

module.exports = router