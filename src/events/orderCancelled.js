class OrderCancelled {
    constructor(orderId, userId, items, totalAmount, lastStatus) {
        this.orderId = orderId
        this.userId = userId
        this.items = items
        this.totalAmount = totalAmount
        this.lastStatus = lastStatus
    }
}

module.exports = OrderCancelled