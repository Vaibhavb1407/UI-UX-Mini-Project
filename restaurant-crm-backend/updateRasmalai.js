const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Menu = require('./models/Menu');

async function updateRasmalai() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const result = await Menu.findOneAndUpdate(
            { name: 'Rasmalai' },
            {
                image: '/images/rasmalai.png',
            },
            { new: true }
        );

        if (result) {
            console.log(`✅ Rasmalai image updated!`);
            console.log(`   Image URL: ${result.image}`);
        } else {
            console.log('❌ Rasmalai not found in database.');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

updateRasmalai();
