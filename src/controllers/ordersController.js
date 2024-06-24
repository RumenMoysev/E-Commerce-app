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

module.exports = router