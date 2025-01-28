const router = require('express').Router()
const insert = require('../controllers/insertData')

router.post('/', insert.insertProduct)
router.post('/cate', insert.insertProductCategory)

module.exports = router