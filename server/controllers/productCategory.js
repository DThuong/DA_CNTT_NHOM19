const ProductCategory = require('../models/productCategory')
const asyncHandler = require('express-async-handler')

const getAllProductCategory = asyncHandler(async (req, res) => {
    const category = await ProductCategory.find().select('title _id brand')
    res.status(200).json({success: category ? true : false, 
        category: category ? category : "cannot find product category"
    })
})

const createProductCategory = asyncHandler(async (req, res) => {
    const category = await ProductCategory.create(req.body)
    res.status(200).json({success: category ? true : false, 
        categoryCreated: category ? category : "cannot create category"
    })
})

const updateProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const category = await ProductCategory.findByIdAndUpdate(pcid, req.body, {new: true})
    res.status(200).json({success: category ? true : false, 
        categoryUpdated: category ? category : "cannot update category"
    })
})

const deleteProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const category = await ProductCategory.findByIdAndDelete(pcid)
    res.status(200).json({success: category ? true : false, 
        categoryDeleted: category ? category : "cannot delete category"
    })
})
module.exports = {
    getAllProductCategory,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory
}
