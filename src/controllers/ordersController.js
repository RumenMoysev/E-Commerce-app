const router = require('express').Router()

const { auth } = require('../middlewares/authMiddleware.js')
const commandHandler = require('../handlers/commandHandler.js')
const queryHandler = require('../handlers/queryHandler.js')

router.get('/find-by-user-id', auth, async (req, res) => {
    try {
        const order = await queryHandler.findByUserId(req.user._id)

        res.status(200).json(order)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await queryHandler.findById(req.params.id)
        if (order.userId != req.user._id) {
            throw new Error('You are not the owner of the order!')
        }

        res.status(200).json(order)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const order = await commandHandler.createOrder(req.body)

        res.status(200).json(order)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/pay-order/:id', auth, async (req, res) => {
    try {
        const order = await queryHandler.findById(req.params.id)

        if(order.userId != req.user._id) {
            throw new Error('You are not the owner of the order!')
        }

        const updatedOrder = await commandHandler.payOrder(req.params.id, order.totalAmount, req.body)

        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/confirm-order/:id', auth, async (req, res) => {
    try {
        const confirmedOrder = await commandHandler.confirmOrder(req.params.id)

        res.status(200).json(confirmedOrder)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/deliver-order/:id', auth, async (req, res) => {
    try {
        const deliveredOrder = await commandHandler.deliverOrder(req.params.id)

        res.status(200).json(deliveredOrder)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/cancel-order/:id', auth, async (req, res) => {
    try {
        const order = await queryHandler.findById(req.params.id)

        if (order.userId != req.user._id) {
            throw new Error('You are not the owner of the order!')
        }

        await commandHandler.cancelOrder(order, req.params.id)

        const infoForUserBasedOnOrderStatus = {
            'Pending': 'Order cancelled successfully',
            'Waiting for confirmation': 'Order cancelled successfully. Your money will be refunded within 14 working days!'
        }

        res.status(200).json({
            information: infoForUserBasedOnOrderStatus[order.status]
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

module.exports = router