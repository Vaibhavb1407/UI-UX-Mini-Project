const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

// @desc    Get admin analytics dashboard
// @route   GET /api/analytics/dashboard
// @access  Admin
const getDashboard = asyncHandler(async (req, res) => {
    // ── Totals ────────────────────────────────────────────
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalReservations = await Reservation.countDocuments({ status: 'Reserved' });

    // Total revenue (sum of all delivered orders)
    const revenueResult = await Order.aggregate([
        { $match: { status: { $in: ['Delivered', 'Preparing', 'Pending'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // ── Popular Dishes ────────────────────────────────────
    const popularDishesRaw = await Order.aggregate([
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.name',
                count: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: '$_id', count: 1, revenue: 1 } },
    ]);

    // ── Orders Per Day (last 7 days) ─────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyOrdersRaw = await Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                count: { $sum: 1 },
                revenue: { $sum: '$totalPrice' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const dailyOrders = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const found = dailyOrdersRaw.find((x) => x._id === dateStr);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        dailyOrders.push({
            date: dateStr,
            day: dayName,
            count: found ? found.count : 0,
            revenue: found ? found.revenue : 0,
        });
    }

    // ── Order Status Breakdown ────────────────────────────
    const statusBreakdown = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // ── Category Revenue ──────────────────────────────────
    const categoryRevenue = await Order.aggregate([
        { $unwind: '$items' },
        {
            $group: {
                _id: null,
                Pizza: {
                    $sum: {
                        $cond: [{ $eq: ['$items.category', 'Pizza'] }, { $multiply: ['$items.price', '$items.quantity'] }, 0],
                    },
                },
            },
        },
    ]);

    res.json({
        success: true,
        data: {
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalReservations,
            popularDishes: popularDishesRaw,
            dailyOrders,
            statusBreakdown,
        },
    });
});

module.exports = { getDashboard };
