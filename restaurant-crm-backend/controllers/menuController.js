const asyncHandler = require('express-async-handler');
const Menu = require('../models/Menu');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getAllMenuItems = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.available) filter.availability = req.query.available === 'true';

    const items = await Menu.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
});

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
    const item = await Menu.findById(req.params.id);
    if (!item) {
        res.status(404);
        throw new Error('Menu item not found');
    }
    res.json({ success: true, data: item });
});

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Admin
const createMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, image, isVeg, prepTime, isBestseller } = req.body;

    if (!name || !price || !category) {
        res.status(400);
        throw new Error('Name, price, and category are required');
    }

    const item = await Menu.create({
        name,
        description,
        price,
        category,
        image: image || '',
        isVeg: isVeg !== undefined ? isVeg : true,
        prepTime: prepTime || '20 min',
        isBestseller: isBestseller || false,
    });

    res.status(201).json({ success: true, data: item });
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Admin
const updateMenuItem = asyncHandler(async (req, res) => {
    const item = await Menu.findById(req.params.id);
    if (!item) {
        res.status(404);
        throw new Error('Menu item not found');
    }

    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json({ success: true, data: updated });
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
    const item = await Menu.findById(req.params.id);
    if (!item) {
        res.status(404);
        throw new Error('Menu item not found');
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Menu item deleted' });
});

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
};
