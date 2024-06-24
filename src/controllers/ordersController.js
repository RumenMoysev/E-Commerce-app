const router = require('express').Router()

const { auth } = require('../middlewares/authMiddleware.js')
const commandHandler = require('../handlers/commandHandler.js')

router.post('/', auth, async (req, res) => {
    const order = await commandHandler.createOrder(req.body)

    res.status(200).send(order)
})

module.exports = router