class OrderCreated {
    constructor(orderId, userId, items, totalAmount) {
        this.orderId = orderId
        this.userId = userId
        this.items = items
        this.totalAmount = totalAmount
    }
}

module.exports = OrderCreated