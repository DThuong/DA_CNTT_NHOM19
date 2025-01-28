const express = require("express")
const router = express.Router()
const blogCategory = require("../controllers/blogCategory")
const {isAdmin, verifyAccessToken} = require("../middlewares/verifyToken")

router.get('/', blogCategory.getAllblogCategory)
router.post('/', [verifyAccessToken, isAdmin], blogCategory.createblogCategory)
router.put('/:bcid', [verifyAccessToken, isAdmin], blogCategory.updateblogCategory)
router.delete('/:bcid', [verifyAccessToken, isAdmin], blogCategory.deleteblogCategory)

module.exports = router