const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        guests: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: 1,
            max: 20,
        },
        tableNumber: {
            type: String,
            default: '',
        },
        specialRequests: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['Reserved', 'Completed', 'Cancelled'],
            default: 'Reserved',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isGroupBooking: {
            type: Boolean,
            default: false,
        },
        occasion: {
            type: String,
            default: '',
        },
        seatingPreference: {
            type: String,
            default: '',
        },
        dietaryRequirements: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
