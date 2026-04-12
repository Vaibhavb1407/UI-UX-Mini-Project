const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Menu = require('./models/Menu');

async function updateImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const updates = [
            { name: 'Gulab Jamun', image: '/images/gulab_jamun.png' },
            { name: 'Mango Lassi', image: '/images/mango_lassi.png' },
        ];

        for (const { name, image } of updates) {
            const result = await Menu.findOneAndUpdate(
                { name },
                { image },
                { new: true }
            );
            if (result) {
                console.log(`✅ ${name} image updated → ${image}`);
            } else {
                console.log(`❌ ${name} not found`);
            }
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
        process.exit(0);
    }
}

updateImages();
