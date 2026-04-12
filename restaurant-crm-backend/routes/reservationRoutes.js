const express = require('express');
const router = express.Router();
const {
    createReservation,
    getAllReservations,
    getReservationById,
    deleteReservation,
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create reservation: optionally attached to logged-in user
router.post('/', (req, res, next) => {
    // Attach user if authenticated, but don't block if not
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return protect(req, res, next);
    }
    next();
}, createReservation);

router.get('/', protect, adminOnly, getAllReservations);
router.get('/:id', protect, adminOnly, getReservationById);
router.delete('/:id', protect, adminOnly, deleteReservation);

module.exports = router;
