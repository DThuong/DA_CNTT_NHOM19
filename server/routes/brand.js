const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const brandCtrls = require('../controllers/brand')

router.get('/', brandCtrls.getAllbrand)
router.post('/', [verifyAccessToken, isAdmin], brandCtrls.createbrand)
router.put('/:bcid', [verifyAccessToken, isAdmin], brandCtrls.updatebrand)
router.delete('/:bcid', [verifyAccessToken, isAdmin], brandCtrls.deletebrand)

module.exports = router