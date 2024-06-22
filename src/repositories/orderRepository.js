const Order = require('../models/Order.js')

class OrderRepository {
    async save(order) {
        const newOrder = await Order.create(order)
        return newOrder
    }

    async findById(id) {
        return await Order.findById(id)
    }

    async findByUserId(userId) {
        return await Order.find({ userId })
    }
}

module.exports = new OrderRepository()