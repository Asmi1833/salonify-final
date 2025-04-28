const mongoose = require('mongoose');
const Salon = require('../models/Salon');
require('dotenv').config();

const sampleSalons = [
  {
    name: "Glamour Hair Studio",
    description: "Luxury hair salon offering cutting-edge styles and treatments",
    address: "123 Fashion Street, New York, NY 10001",
    phone: "(212) 555-0123",
    email: "info@glamourhair.com",
    images: [
      "https://images.unsplash.com/photo-1560067174-c5a3a8f37060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1969&q=80"
    ],
    services: [
      {
        name: "Haircut & Style",
        description: "Professional haircut and styling service",
        price: 45,
        duration: 60
      },
      {
        name: "Hair Coloring",
        description: "Full hair coloring service with premium products",
        price: 85,
        duration: 120
      },
      {
        name: "Hair Treatment",
        description: "Deep conditioning and treatment",
        price: 65,
        duration: 45
      }
    ],
    opening_time: "09:00",
    closing_time: "20:00",
    rating: 4.8
  },
  {
    name: "Nail Art Studio",
    description: "Creative nail art and spa treatments",
    address: "456 Beauty Avenue, Los Angeles, CA 90001",
    phone: "(310) 555-0456",
    email: "info@nailartstudio.com",
    images: [
      "https://images.unsplash.com/photo-1610992018333-f839b4de9f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1610992018333-f839b4de9f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    services: [
      {
        name: "Manicure",
        description: "Classic manicure with polish",
        price: 35,
        duration: 45
      },
      {
        name: "Pedicure",
        description: "Luxury pedicure with massage",
        price: 55,
        duration: 60
      },
      {
        name: "Nail Art",
        description: "Custom nail art design",
        price: 25,
        duration: 30
      }
    ],
    opening_time: "10:00",
    closing_time: "19:00",
    rating: 4.6
  },
  {
    name: "Spa & Wellness Center",
    description: "Full-service spa offering massage and beauty treatments",
    address: "789 Wellness Blvd, Miami, FL 33101",
    phone: "(305) 555-0789",
    email: "info@spawellness.com",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80"
    ],
    services: [
      {
        name: "Swedish Massage",
        description: "Relaxing full-body massage",
        price: 90,
        duration: 60
      },
      {
        name: "Facial Treatment",
        description: "Luxury facial with premium products",
        price: 75,
        duration: 45
      },
      {
        name: "Body Scrub",
        description: "Exfoliating body treatment",
        price: 65,
        duration: 45
      }
    ],
    opening_time: "09:00",
    closing_time: "21:00",
    rating: 4.9
  }
];

const seedSalons = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salonify');
    console.log('Connected to MongoDB');

    // Clear existing salons
    await Salon.deleteMany({});
    console.log('Cleared existing salons');

    // Insert sample salons
    const insertedSalons = await Salon.insertMany(sampleSalons);
    console.log(`Inserted ${insertedSalons.length} salons`);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding salons:', error);
    process.exit(1);
  }
};

seedSalons(); 