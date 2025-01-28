const blogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const getAllblogCategory = asyncHandler(async (req, res) => {
    const category = await blogCategory.find().select('title _id')
    res.status(200).json({success: category ? true : false, 
        category: category ? category : "cannot find blog category"
    })
})

const createblogCategory = asyncHandler(async (req, res) => {
    const category = await blogCategory.create(req.body)
    res.status(200).json({success: category ? true : false, 
        categoryCreated: category ? category : "cannot create blog category"
    })
})

const updateblogCategory = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const category = await blogCategory.findByIdAndUpdate(bcid, req.body, {new: true})
    res.status(200).json({success: category ? true : false, 
        categoryUpdated: category ? category : "cannot update blog category"
    })
})

const deleteblogCategory = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const category = await blogCategory.findByIdAndDelete(bcid)
    res.status(200).json({success: category ? true : false, 
        categoryDeleted: category ? category : "cannot delete blog category"
    })
})
module.exports = {
    getAllblogCategory,
    createblogCategory,
    updateblogCategory,
    deleteblogCategory
}
