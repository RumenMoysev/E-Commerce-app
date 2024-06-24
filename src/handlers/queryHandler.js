const OrderQueryRepository = require("../repositories/orderQueryRepository.js")

exports.update = async (event) => {
    return await OrderQueryRepository.update(event)
}

exports.findById = async (orderId) => {
    return await OrderQueryRepository.findById(orderId)
}

exports.findByUserId = async (userId) => {
    return await OrderQueryRepository.findByUserId(userId)
}