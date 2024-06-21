const Order = require('../models/Order.js')

class OrderRepository {
    async save(order) {
        const newOrder = new Order(order)
        await newOrder.save()
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