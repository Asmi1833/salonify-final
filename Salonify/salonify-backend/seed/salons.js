const mongoose = require('mongoose');
const Salon = require('../models/Salon');
require('dotenv').config();

const sampleSalons = [
  {
    name: "Luxe Hair & Beauty",
    description: "Experience luxury beauty treatments in our modern, sophisticated salon. Our expert stylists and aestheticians provide premium services in a relaxing atmosphere.",
    address: "123 Fashion Avenue, New York, NY 10001",
    phone: "(212) 555-0123",
    email: "info@luxehairbeauty.com",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80"
    ],
    services: [
      {
        name: "Haircut & Styling",
        description: "Professional haircut and styling with our expert stylists",
        price: 65,
        duration: 60
      },
      {
        name: "Hair Coloring",
        description: "Full color service with premium products",
        price: 120,
        duration: 120
      },
      {
        name: "Manicure & Pedicure",
        description: "Luxury nail care treatment",
        price: 85,
        duration: 90
      }
    ],
    opening_time: "09:00",
    closing_time: "20:00",
    rating: 4.8
  },
  {
    name: "Urban Style Studio",
    description: "Contemporary salon specializing in modern cuts and trendy styles. Our creative team stays ahead of the latest trends to bring you the most fashionable looks.",
    address: "456 Trend Street, Los Angeles, CA 90001",
    phone: "(310) 555-0456",
    email: "info@urbanstyle.com",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    services: [
      {
        name: "Men's Haircut",
        description: "Classic and modern men's haircuts",
        price: 45,
        duration: 45
      },
      {
        name: "Women's Haircut",
        description: "Trendy women's haircuts and styling",
        price: 55,
        duration: 60
      },
      {
        name: "Hair Treatment",
        description: "Deep conditioning and treatment",
        price: 75,
        duration: 60
      }
    ],
    opening_time: "10:00",
    closing_time: "19:00",
    rating: 4.6
  },
  {
    name: "Glamour Spa & Salon",
    description: "Full-service spa and salon offering comprehensive beauty treatments. From hair styling to facials, we provide a complete beauty experience.",
    address: "789 Beauty Lane, Chicago, IL 60601",
    phone: "(312) 555-0789",
    email: "info@glamourspa.com",
    images: [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
    ],
    services: [
      {
        name: "Facial Treatment",
        description: "Luxury facial with premium products",
        price: 95,
        duration: 60
      },
      {
        name: "Massage Therapy",
        description: "Relaxing massage service",
        price: 110,
        duration: 60
      },
      {
        name: "Makeup Application",
        description: "Professional makeup for any occasion",
        price: 65,
        duration: 45
      }
    ],
    opening_time: "09:00",
    closing_time: "21:00",
    rating: 4.9
  },
  {
    name: "Natural Beauty Salon",
    description: "Eco-friendly salon specializing in natural and organic beauty treatments. We use sustainable products and practices to enhance your natural beauty.",
    address: "321 Green Street, San Francisco, CA 94101",
    phone: "(415) 555-0321",
    email: "info@naturalbeauty.com",
    images: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    services: [
      {
        name: "Organic Hair Treatment",
        description: "Natural hair care treatment",
        price: 85,
        duration: 75
      },
      {
        name: "Natural Facial",
        description: "Organic facial treatment",
        price: 90,
        duration: 60
      },
      {
        name: "Organic Manicure",
        description: "Natural nail care treatment",
        price: 70,
        duration: 45
      }
    ],
    opening_time: "10:00",
    closing_time: "18:00",
    rating: 4.7
  }
];

const seedSalons = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salonify');
    console.log('Connected to MongoDB');

    // Clear existing salons
    await Salon.deleteMany({});
    console.log('Cleared existing salons');

    // Add sample salons
    for (const salon of sampleSalons) {
      const newSalon = new Salon({
        ...salon,
        owner: '65f2d8b9c4f8a3e2d1c0b9a8' // Replace with a valid user ID from your database
      });
      await newSalon.save();
    }

    console.log('Sample salons added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding salons:', error);
    process.exit(1);
  }
};

seedSalons(); 