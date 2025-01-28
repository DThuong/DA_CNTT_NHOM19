const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    if(!title || !description || !category){
        res.status(404).json({msg: "missing inputs"})
    }
    const blog = await Blog.create(req.body)
    res.status(200).json({success: blog ? true :false, blogCreated: blog ? blog : "cannot create blog"})
})

const updateBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if(Object.keys(bid).length === 0) throw new Error('missing inputs')
    const updateBlog = await Blog.findByIdAndUpdate(bid, req.body, {new: true})
    return res.status(200).json({success: updateBlog ? true : false, updateBlogCreated: updateBlog})
})

const getBlogs = asyncHandler(async (req, res) => {
    const blog = await Blog.find()
    res.status(200).json({success: blog ? true : false, blog})
})

// Khi một người dùng like 1 bài blog thì
// check xem người đó trước đó có dislike hay không : bỏ dislike, + like
// ngược lại, check xem người đó trước đó có like hay không: bỏ like
// Hàm $pull kéo thuộc tính ra ngoài object
// Hàm $push thêm thuộc tính vào trong object
const likeBlogs = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error('missing inputs')
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isliked = blog?.likes?.find(el => el.toString() === _id)
    if(isliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid, {$push: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

// Khi một người dùng dislike 1 bài blog thì
// check xem người đó trước đó có like hay không : bỏ like, + dislike
// ngược lại, check xem người đó trước đó có dislike hay không: bỏ dislike
// Hàm $pull kéo thuộc tính ra ngoài object
// Hàm $push thêm thuộc tính vào trong object
const dislikeBlogs = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error('missing blog query parameter')
    const blog = await Blog.findById(bid)
    const alreadyliked = blog?.likes?.find(el => el.toString() === _id)
    if(alreadyliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid, {$push: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const getDetailBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const getBlog = await Blog.findByIdAndUpdate(bid, {$inc: {numberViews: 1}}, {new: true})
        .populate('likes', 'firstName lastName',)
        .populate('dislikes', 'firstName lastName')
    return res.status(200).json({
        success: getBlog ? true : false,
        blog: getBlog
    })
})

const deleteBlog = asyncHandler( async (req, res) => {
    const {bid} = req.params
    const deleteBlog = await Blog.findByIdAndDelete(bid)
    return res.status(200).json({
        success: deleteBlog ? true : false,
        deleteBlog
    })
})

// upload image blog
// bỏ hàm $push: chỉ sử dụng cho từ 2 string đổ lên
const uploadImageBlog = asyncHandler(async(req, res) => {
    const {bid} = req.params
    if(!req.file) throw new Error('Missing file')
    const response = await Blog.findByIdAndUpdate(bid, {image: req.file.path}, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'cannot put file into cloud storage'
    })
})

module.exports = {
    createBlog,
    updateBlog,
    getBlogs,
    likeBlogs,
    dislikeBlogs,
    getDetailBlog,
    deleteBlog,
    uploadImageBlog
}