const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const order = require('../controllers/order')

router.get('/', [verifyAccessToken, isAdmin], order.getUserOrder)
router.post('/', [verifyAccessToken] , order.createOrder)
router.put('/:oid', [verifyAccessToken] , order.updateStatusOrder)

module.exports = router