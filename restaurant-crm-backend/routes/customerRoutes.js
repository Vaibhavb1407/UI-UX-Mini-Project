const express = require('express');
const router = express.Router();
const {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    redeemPoints,
} = require('../controllers/customerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllCustomers);
router.get('/:id', protect, getCustomerById);
router.put('/:id', protect, updateCustomer);
router.put('/:id/redeem', protect, redeemPoints);

module.exports = router;
