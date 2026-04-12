const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Menu = require('./models/Menu');

const menuItems = [
    // 🍕 Pizzas
    {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella cheese & basil',
        price: 249,
        category: 'Pizza',
        isVeg: true,
        prepTime: '20 min',
        isBestseller: true,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
    },
    {
        name: 'Farmhouse Pizza',
        description: 'Onion, capsicum, tomato, mushroom with cheese',
        price: 349,
        category: 'Pizza',
        isVeg: true,
        prepTime: '25 min',
        isBestseller: false,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
    },
    {
        name: 'Paneer Tikka Pizza',
        description: 'Spicy paneer tikka, onion, capsicum, cheese',
        price: 399,
        category: 'Pizza',
        isVeg: true,
        prepTime: '25 min',
        isBestseller: true,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80',
    },
    {
        name: 'Veggie Supreme',
        description: 'Corn, olives, capsicum, onion, jalapenos',
        price: 379,
        category: 'Pizza',
        isVeg: true,
        prepTime: '22 min',
        isBestseller: false,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
    },
    {
        name: 'Cheese Burst Pizza',
        description: 'Loaded with extra cheese filling',
        price: 429,
        category: 'Pizza',
        isVeg: true,
        prepTime: '28 min',
        isBestseller: true,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=500&q=80',
    },
    {
        name: 'Tandoori Paneer Pizza',
        description: 'Tandoori paneer with Indian spices',
        price: 419,
        category: 'Pizza',
        isVeg: true,
        prepTime: '28 min',
        isBestseller: false,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',
    },

    // 🍔 Burgers
    {
        name: 'Veg Classic Burger',
        description: 'Veg patty, lettuce, tomato & mayo',
        price: 129,
        category: 'Burgers',
        isVeg: true,
        prepTime: '15 min',
        isBestseller: false,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    },
    {
        name: 'Aloo Tikki Burger',
        description: 'Spicy aloo tikki with mint sauce',
        price: 119,
        category: 'Burgers',
        isVeg: true,
        prepTime: '12 min',
        isBestseller: true,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=500&q=80',
    },
    {
        name: 'Paneer Burger',
        description: 'Grilled paneer patty with cheese',
        price: 169,
        category: 'Burgers',
        isVeg: true,
        prepTime: '15 min',
        isBestseller: false,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80',
    },
    {
        name: 'Cheese Burst Burger',
        description: 'Double cheese with crispy veg patty',
        price: 189,
        category: 'Burgers',
        isVeg: true,
        prepTime: '18 min',
        isBestseller: true,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    },
    {
        name: 'Spicy Masala Burger',
        description: 'Indian masala patty with spicy sauce',
        price: 149,
        category: 'Burgers',
        isVeg: true,
        prepTime: '15 min',
        isBestseller: false,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&q=80',
    },

    // 🥤 Drinks
    {
        name: 'Coca Cola',
        description: 'Chilled soft drink',
        price: 60,
        category: 'Drinks',
        isVeg: true,
        prepTime: '2 min',
        isBestseller: false,
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80',
    },
    {
        name: 'Mango Lassi',
        description: 'Traditional Indian yogurt mango drink',
        price: 120,
        category: 'Drinks',
        isVeg: true,
        prepTime: '5 min',
        isBestseller: true,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1587015990127-424b954571a7?w=500&q=80',
    },
    {
        name: 'Cold Coffee',
        description: 'Coffee with milk & ice cream',
        price: 140,
        category: 'Drinks',
        isVeg: true,
        prepTime: '5 min',
        isBestseller: true,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
    },
    {
        name: 'Lemon Soda',
        description: 'Refreshing lemon soda drink',
        price: 80,
        category: 'Drinks',
        isVeg: true,
        prepTime: '3 min',
        isBestseller: false,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80',
    },
    {
        name: 'Masala Chai',
        description: 'Indian spiced tea',
        price: 50,
        category: 'Drinks',
        isVeg: true,
        prepTime: '5 min',
        isBestseller: false,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&q=80',
    },
    {
        name: 'Chocolate Milkshake',
        description: 'Thick chocolate shake',
        price: 160,
        category: 'Drinks',
        isVeg: true,
        prepTime: '7 min',
        isBestseller: true,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80',
    },

    // 🍨 Desserts
    {
        name: 'Gulab Jamun',
        description: 'Sweet Indian dessert with sugar syrup',
        price: 90,
        category: 'Desserts',
        isVeg: true,
        prepTime: '10 min',
        isBestseller: true,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1666761571441-a91d0863dc37?w=500&q=80',
    },
    {
        name: 'Chocolate Brownie',
        description: 'Warm brownie with chocolate sauce',
        price: 150,
        category: 'Desserts',
        isVeg: true,
        prepTime: '10 min',
        isBestseller: false,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
    },
    {
        name: 'Vanilla Ice Cream',
        description: 'Classic vanilla scoop',
        price: 100,
        category: 'Desserts',
        isVeg: true,
        prepTime: '3 min',
        isBestseller: false,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&q=80',
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Molten chocolate cake',
        price: 160,
        category: 'Desserts',
        isVeg: true,
        prepTime: '15 min',
        isBestseller: true,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1617305855058-336d24456869?w=500&q=80',
    },
    {
        name: 'Rasmalai',
        description: 'Soft paneer balls in sweet milk',
        price: 120,
        category: 'Desserts',
        isVeg: true,
        prepTime: '10 min',
        isBestseller: false,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1601303516534-bf5c8b85ee5d?w=500&q=80',
    },
];

async function seedMenu() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing menu items
        await Menu.deleteMany({});
        console.log('🗑️  Cleared existing menu items');

        // Insert all items
        const inserted = await Menu.insertMany(menuItems);
        console.log(`🌱 Seeded ${inserted.length} menu items successfully!`);

        inserted.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} (${item.category}) - ₹${item.price}`);
        });

    } catch (error) {
        console.error('❌ Seeding error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

seedMenu();
