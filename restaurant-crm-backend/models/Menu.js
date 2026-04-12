const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Menu item name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        category: {
            type: String,
            enum: ['Pizza', 'Burgers', 'Drinks', 'Desserts'],
            required: [true, 'Category is required'],
        },
        image: {
            type: String,
            default: '',
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },
        prepTime: {
            type: String,
            default: '20 min',
        },
        isBestseller: {
            type: Boolean,
            default: false,
        },
        availability: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
