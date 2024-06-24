const router = require('express').Router()
const userController = require('./controllers/userController.js')
const ordersController = require('./controllers/ordersController.js')

router.use('/users', userController)
router.use('/orders', ordersController)

module.exports = router