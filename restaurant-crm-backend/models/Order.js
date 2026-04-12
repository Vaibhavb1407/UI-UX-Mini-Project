const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Preparing', 'Served', 'Billed', 'Cancelled'],
            default: 'Pending',
        },
        tableNumber: {
            type: String,
            default: null,
        },
        orderTime: {
            type: Date,
            default: Date.now,
        },
        deliveryAddress: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
