const asyncHandler = require('express-async-handler');
const Coupon = require('../models/coupon')

const createCoupon = asyncHandler(async (req, res) => {
    const {name, discount, expiry} = req.body
    if(!name || !discount || !expiry) throw new Error('missing input')
    const createCoupon = await Coupon.create({...req.body, expiry: Date.now() + +expiry*24*60*60*1000})
    return res.status(200).json({
        success: createCoupon ? true : false,
        createdCoupon: createCoupon ? createCoupon : 'cannot create a coupon'
    })
})

const getCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.find().select('-createdAt -updatedAt')
    return res.status(200).json({success: coupon ? true : false, CouponFinded: coupon ? coupon : 'cannot get a coupon'})
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('missing input')
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry*24*60*60*1000 
    const updateCoupon = await Coupon.findByIdAndUpdate(cid, req.body, {new: true})
    return res.status(200).json({
        success: updateCoupon ? true : false,
        updatedCoupon: updateCoupon ? updateCoupon : 'cannot update a coupon'
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const {cid} = req.params
    const deleteCoupon = await Coupon.findByIdAndDelete(cid)
    return res.status(200).json({
        success: deleteCoupon ? true : false,
        deleteCoupon: deleteCoupon ? deleteCoupon : 'cannot delete a coupon'
    })
})

module.exports = {
    createCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,
}