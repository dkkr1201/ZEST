const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }
    ],
    amount: Number,
    paymentStatus: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;