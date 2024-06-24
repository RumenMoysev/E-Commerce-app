const { OrderCommandModel } = require('../models/OrderCommandModel.js')

class OrderCommandRepository {
    async save(order) {
        const newOrder = await OrderCommandModel.create(order)
        return newOrder
    }
}

module.exports = new OrderCommandRepository()