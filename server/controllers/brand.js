const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const getAllbrand = asyncHandler(async (req, res) => {
    const brand = await Brand.find().select('title _id')
    res.status(200).json({
        success: brand ? true : false, 
        brand: brand ? brand : "cannot find brand"
    })
})

const createbrand = asyncHandler(async (req, res) => {
    const brand = await Brand.create(req.body)
    res.status(200).json({success: brand ? true : false, 
        brandCreated: brand ? brand : "cannot create brand"
    })
})

const updatebrand = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const brand = await Brand.findByIdAndUpdate(bcid, req.body, {new: true})
    res.status(200).json({success: brand ? true : false, 
        brandUpdated: brand ? brand : "cannot update brand"
    })
})

const deletebrand = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const brand = await Brand.findByIdAndDelete(bcid)
    res.status(200).json({success: brand ? true : false, 
        brandDeleted: brand ? brand : "cannot delete brand"
    })
})
module.exports = {
    getAllbrand,
    createbrand,
    updatebrand,
    deletebrand
}
