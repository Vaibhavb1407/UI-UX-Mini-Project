const Order = require('../models/Order');

// @desc    Get active orders (Pending & Preparing) for chef dashboard
// @route   GET /api/chef/active
// @access  Private/Admin
const getActiveOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $in: ['Pending', 'Preparing'] } })
            .populate('customer', 'name email phone')
            .sort({ createdAt: 1 }); // Oldest first
            
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getActiveOrders
};
