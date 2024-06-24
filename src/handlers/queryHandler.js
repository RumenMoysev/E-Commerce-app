const OrderRepository = require("../repositories/orderRepository.js")

exports.findById = async (orderId) => {
    return await OrderRepository.findById(orderId)
}

exports.findByUserId = async (userId) => {
    return await OrderRepository.findByUserId(userId)
}