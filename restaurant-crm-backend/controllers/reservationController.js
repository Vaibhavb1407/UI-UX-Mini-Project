const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');

// @desc    Create a table reservation
// @route   POST /api/reservations
// @access  Public (or Private if logged in)
const createReservation = asyncHandler(async (req, res) => {
    const { 
        customerName, 
        phone, 
        date, 
        time, 
        guests, 
        tableNumber, 
        specialRequests, 
        isGroupBooking, 
        occasion, 
        seatingPreference, 
        dietaryRequirements 
    } = req.body;

    if (!customerName || !phone || !date || !time || !guests) {
        res.status(400);
        throw new Error('Please provide name, phone, date, time and guests');
    }

    const reservation = await Reservation.create({
        customerName,
        phone,
        date,
        time,
        guests,
        tableNumber: tableNumber || '',
        specialRequests: specialRequests || '',
        isGroupBooking: isGroupBooking || false,
        occasion: occasion || '',
        seatingPreference: seatingPreference || '',
        dietaryRequirements: dietaryRequirements || '',
        user: req.user ? req.user._id : undefined,
    });

    res.status(201).json({ success: true, data: reservation });
});

// @desc    Get all reservations (admin) or filter by phone
// @route   GET /api/reservations
// @access  Admin (all) / Public (by phone query)
const getAllReservations = asyncHandler(async (req, res) => {
    let query = {};

    if (req.user && req.user.role === 'admin') {
        // Admin sees all; support optional status filter
        if (req.query.status) query.status = req.query.status;
    } else if (req.query.phone) {
        query.phone = req.query.phone;
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, data: reservations });
});

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Admin
const getReservationById = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found');
    }
    res.json({ success: true, data: reservation });
});

// @desc    Cancel / delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Admin
const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found');
    }

    // Soft-cancel instead of delete to preserve history
    reservation.status = 'Cancelled';
    await reservation.save();

    res.json({ success: true, message: 'Reservation cancelled', data: reservation });
});

module.exports = {
    createReservation,
    getAllReservations,
    getReservationById,
    deleteReservation,
};
