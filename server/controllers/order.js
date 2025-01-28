const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Order = require('../models/order');

const createOrder = asyncHandler(async(req,res) => {
    const {_id} = req.user
    const {coupon} = req.body
    const cartUser = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = cartUser?.cart?.map((el) =>({
        product: el.product._id,
        count: el.quantity,
        color: el.color,
    }))
    let total = cartUser?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
    const createData = { products , total, orderBy: _id}
    if(coupon) {
        const selectedCoupon = await Order.findById(coupon)
        total = Math.round(total * (1- +selectedCoupon?.discount / 100) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const response = await Order.create(createData)
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'something went wrong',
    })
})

const updateStatusOrder = asyncHandler(async(req,res) => {
    const {oid} = req.params
    const {status} = req.body
    if(!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, {status}, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'something went wrong'
    })
})

const getUserOrder = asyncHandler(async(req,res) => {
    const {_id} = req.user
    const getAll = await Order.find({orderBy: _id})
    return res.status(200).json({
        success: getAll ? true : false,
        getAll: getAll ? getAll : 'something went wrong'
    })
})

module.exports = {
    createOrder,
    updateStatusOrder,
    getUserOrder,
}