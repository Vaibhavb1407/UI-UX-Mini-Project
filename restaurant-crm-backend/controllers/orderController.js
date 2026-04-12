const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { items, totalPrice, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items provided');
    }

    const order = await Order.create({
        customer: req.user._id,
        items,
        totalPrice,
        deliveryAddress: deliveryAddress || '',
        tableNumber: req.body.tableNumber || null,
    });

    // Award loyalty points (1 point per ₹1 spent, rounded)
    const pointsEarned = Math.floor(totalPrice / 10);
    await User.findByIdAndUpdate(req.user._id, {
        $inc: { loyaltyPoints: pointsEarned },
    });

    await order.populate('customer', 'name email phone');

    // Emit new order to chef room
    const io = req.app.get('io');
    if (io) {
        io.to('chef-room').emit('newOrder', order);
    }

    res.status(201).json({
        success: true,
        data: order,
        loyaltyPointsEarned: pointsEarned,
    });
});

// @desc    Get orders (admin: all, customer: own)
// @route   GET /api/orders
// @access  Private
const getAllOrders = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role !== 'admin') {
        query.customer = req.user._id;
    }

    const orders = await Order.find(query)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'customer',
        'name email phone'
    );

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Customer can only view their own orders
    if (
        req.user.role !== 'admin' &&
        order.customer._id.toString() !== req.user._id.toString()
    ) {
        res.status(403);
        throw new Error('Not authorised to view this order');
    }

    res.json({ success: true, data: order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Served', 'Billed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    ).populate('customer', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Emit status update
    const io = req.app.get('io');
    if (io) {
        io.to('chef-room').emit('orderStatusUpdate', order);
        if (order.customer) {
            io.to(`customer-${order.customer._id}`).emit('orderStatusUpdate', order);
        }
    }

    res.json({ success: true, data: order });
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    await order.deleteOne();
    res.json({ success: true, message: 'Order deleted' });
});

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
};
