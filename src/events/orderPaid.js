class OrderPaid {
    constructor(orderId, totalAmount, paymentDetails) {
        this.orderId = orderId
        this.totalAmount = totalAmount
        this.paymentDetails = paymentDetails
    }
}

module.exports = OrderPaid