const router = require('express').Router();
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const couponCtrls = require('../controllers/coupon')

router.get('/', [verifyAccessToken, isAdmin], couponCtrls.getCoupon)
router.post('/', [verifyAccessToken, isAdmin], couponCtrls.createCoupon)
router.put('/:cid', [verifyAccessToken, isAdmin], couponCtrls.updateCoupon)
router.delete('/:cid', [verifyAccessToken, isAdmin], couponCtrls.deleteCoupon)

module.exports = router