const express = require('express');
const router = express.Router();
const { getActiveOrders } = require('../controllers/chefController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all active orders for the kitchen
router.get('/active', protect, adminOnly, getActiveOrders);

module.exports = router;
