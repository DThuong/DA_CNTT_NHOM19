const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const blog = require('../controllers/blog')
const uploader = require('../config/cloudinary.config')

router.get('/', [verifyAccessToken, isAdmin], blog.getBlogs)
router.get('/details/:bid', [verifyAccessToken, isAdmin], blog.getDetailBlog)
router.post('/', [verifyAccessToken, isAdmin], blog.createBlog)
router.put('/upload/:bid', [verifyAccessToken, isAdmin], uploader.single('image'), blog.uploadImageBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], blog.updateBlog)
router.put('/likes/:bid', [verifyAccessToken, isAdmin], blog.likeBlogs)
router.put('/dislikes/:bid', [verifyAccessToken, isAdmin], blog.dislikeBlogs)
router.delete('/:bid', [verifyAccessToken, isAdmin], blog.deleteBlog)

module.exports = router