const { v4: uuidv4 } = require('uuid')

const eventManager = require('../managers/eventManager.js')
const OrderCreated = require('../events/orderCreated.js')
const OrderRepository = require('../repositories/orderRepository.js')
const OrderPaid = require('../events/orderPaid.js')
const OrderConfirmed = require('../events/orderConfirmed.js')
const OrderDelivered = require('../events/orderDelivered.js')
const OrderCancelled = require('../events/orderCancelled.js')

const possibleStatusesForEachCase = {
    'OrderPaid': 'Pending',
    'OrderConfirmed': 'Waiting for confirmation',
    'OrderDelivered': 'Confirmed',
    'OrderCancelled': ['Pending', 'Waiting for confirmation']
}

async function saveEventAndUpdateReadModel(event) {
    const newEvent = await eventManager.saveEvent(event)

    return await OrderRepository.update(newEvent)
}

exports.createOrder = ({userId, items}) => {
    const orderId = uuidv4()
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    const orderCreatedEvent = new OrderCreated(orderId, userId, items, totalAmount)
    const createdOrder = saveEventAndUpdateReadModel(orderCreatedEvent)
    
    return createdOrder
}

exports.payOrder = async (orderId, totalAmount, paymentDetails) => {
    const order = await OrderRepository.findById(orderId)

    if (order.status != possibleStatusesForEachCase.OrderPaid) {
        throw new Error("You can't pay this order")
    }

    if(paymentDetails.hasEnoughMoney) {
        const orderPaidEvent = new OrderPaid(orderId, totalAmount, paymentDetails)
        const paidOrder = saveEventAndUpdateReadModel(orderPaidEvent)

        return paidOrder
    } else {
        throw new Error("You don't have enough money")
    }
}

exports.confirmOrder = async (orderId) => {
    const order = await OrderRepository.findById(orderId)

    if (order.status != possibleStatusesForEachCase.OrderConfirmed) {
        throw new Error("You can't confirm this order")
    }

    const orderConfirmedEvent = new OrderConfirmed(orderId, order.paymentDetails.streetForDelivery)
    const confirmedOrder = saveEventAndUpdateReadModel(orderConfirmedEvent)

    return confirmedOrder
}

exports.deliverOrder = async (orderId) => {
    const order = await OrderRepository.findById(orderId)

    if(order.status != possibleStatusesForEachCase.OrderDelivered) {
        throw new Error("You can't deliver this order")
    }

    const orderDelieveredEvent = new OrderDelivered(orderId, order.paymentDetails.streetForDelivery)
    const deliveredOrder = saveEventAndUpdateReadModel(orderDelieveredEvent)

    return deliveredOrder
}

exports.cancelOrder = async (order, orderId) => {
    if (!possibleStatusesForEachCase.OrderCancelled.includes(order.status)) {
        throw new Error("You can't cancel this order")
    }

    const orderDelieveredEvent = new OrderCancelled(orderId, order.userId, order.items, order.totalAmount, order.status)
    await saveEventAndUpdateReadModel(orderDelieveredEvent)
}