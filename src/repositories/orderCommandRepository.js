const {Order} = require('../models/Order.js')

class OrderCommandRepository {
    async save(order) {
        const newOrder = await Order.create(order)
        return newOrder
    }
}

module.exports = new OrderCommandRepository()