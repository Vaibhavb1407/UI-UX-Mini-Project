const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Admin
const getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await User.find({ role: 'customer' })
        .select('-password')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, data: customers });
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Admin or Self
const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    // Only admin or the customer themselves
    if (
        req.user.role !== 'admin' &&
        req.user._id.toString() !== req.params.id
    ) {
        res.status(403);
        throw new Error('Not authorised');
    }

    res.json({ success: true, data: customer });
});

// @desc    Update customer (profile / loyalty points)
// @route   PUT /api/customers/:id
// @access  Admin or Self
const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await User.findById(req.params.id);
    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    if (
        req.user.role !== 'admin' &&
        req.user._id.toString() !== req.params.id
    ) {
        res.status(403);
        throw new Error('Not authorised');
    }

    const allowedFields = ['name', 'phone'];
    // Admins can also update loyaltyPoints
    if (req.user.role === 'admin') allowedFields.push('loyaltyPoints');

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) customer[field] = req.body[field];
    });

    const updated = await customer.save();
    res.json({ success: true, data: updated });
});

// @desc    Redeem loyalty points for a reward
// @route   PUT /api/customers/:id/redeem
// @access  Private (self)
const redeemPoints = asyncHandler(async (req, res) => {
    const { pointsToRedeem } = req.body;

    if (!pointsToRedeem || pointsToRedeem <= 0) {
        res.status(400);
        throw new Error('Invalid points amount');
    }

    const customer = await User.findById(req.params.id);
    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    if (customer.loyaltyPoints < pointsToRedeem) {
        res.status(400);
        throw new Error(`Insufficient points. You have ${customer.loyaltyPoints} pts.`);
    }

    customer.loyaltyPoints -= pointsToRedeem;
    await customer.save();

    res.json({
        success: true,
        message: `Successfully redeemed ${pointsToRedeem} points`,
        data: { remainingPoints: customer.loyaltyPoints },
    });
});

module.exports = {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    redeemPoints,
};
