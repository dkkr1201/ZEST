require('dotenv').config();
const Product = require('./models/product');
const mongoose = require('mongoose');

const db_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/zest-db';

async function seedData() {
    try {
        await mongoose.connect(db_URL, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to zest-db');

        // await Product.deleteMany({});
        console.log('Will not clear existing products (Preserving User Data).');

        const dummy_data = [
            {
                name:'Drone',
                image:'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                price:200,
                desc:'Foldable Drone with HD Camera, perfect for aerial shots.'
            },
            {
                name:'Smartphone',
                image:'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                price:750,
                desc:'Latest model smartphone with excellent battery life.'
            },
            {
                name:'Laptop',
                image:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                price:1200,
                desc:'Lightweight laptop for developers and creators.'
            },
            {
                name:'Running Shoes',
                image:'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                price:120,
                desc:'Comfortable and durable running shoes.'
            },
            {
                name:'Smart Watch',
                image:'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                price:199,
                desc:'Track your fitness and notifications on the go.'
            },
            {
                name:'Headphones',
                image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                price:99,
                desc:'Noise-cancelling over-ear headphones.'
            }
        ];

        await Product.create(dummy_data);
        console.log('✓ DB seeded with 6 products!');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding:', err.message);
        process.exit(1);
    }
}

seedData();
