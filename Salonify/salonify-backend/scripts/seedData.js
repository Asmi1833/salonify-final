const mongoose = require('mongoose');
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
require('dotenv').config();

// Sample data from api.js
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
    opening_time: "09:00",
    closing_time: "20:00",
    rating: 4.8,
    numReviews: 12
  },
  {
    name: "Nail Art Studio",
    description: "Creative nail art and spa treatments",
    address: "456 Beauty Avenue, Los Angeles, CA 90001",
    phone: "(310) 555-0456",
    email: "info@nailartstudio.com",
    images: [
      "https://images.unsplash.com/photo-1610992018333-f839b4de9f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    opening_time: "10:00",
    closing_time: "19:00",
    rating: 4.6,
    numReviews: 8
  }
];

const sampleServices = [
  {
    name: "Haircut & Style",
    description: "Professional haircut and styling service",
    price: 45,
    duration: 60,
    image: "https://images.unsplash.com/photo-1560067174-c5a3a8f37060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
  },
  {
    name: "Hair Coloring",
    description: "Full hair coloring service with premium products",
    price: 85,
    duration: 120,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1969&q=80"
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    role: "client"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    role: "salon_owner"
  }
];

const sampleStaff = [
  {
    name: "Sarah Johnson",
    position: "Senior Stylist",
    bio: "Specialized in modern haircuts and coloring",
    specialties: ["Haircutting", "Coloring", "Styling"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1969&q=80"
  },
  {
    name: "Mike Wilson",
    position: "Color Specialist",
    bio: "Expert in creative coloring techniques",
    specialties: ["Balayage", "Ombre", "Color Correction"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1560067174-c5a3a8f37060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salonify');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Salon.deleteMany({}),
      Service.deleteMany({}),
      User.deleteMany({}),
      Staff.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert salons
    const insertedSalons = await Salon.insertMany(sampleSalons);
    console.log(`Inserted ${insertedSalons.length} salons`);

    // Insert services with salon references
    const servicesWithSalonIds = sampleServices.map(service => ({
      ...service,
      salon_id: insertedSalons[0]._id // Assign to first salon
    }));
    const insertedServices = await Service.insertMany(servicesWithSalonIds);
    console.log(`Inserted ${insertedServices.length} services`);

    // Insert users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`Inserted ${insertedUsers.length} users`);

    // Insert staff with salon references
    const staffWithSalonIds = sampleStaff.map(staff => ({
      ...staff,
      salon_id: insertedSalons[0]._id // Assign to first salon
    }));
    const insertedStaff = await Staff.insertMany(staffWithSalonIds);
    console.log(`Inserted ${insertedStaff.length} staff members`);

    // Create some sample bookings
    const sampleBookings = [
      {
        salon_id: insertedSalons[0]._id,
        service_id: insertedServices[0]._id,
        staff_id: insertedStaff[0]._id,
        user_id: insertedUsers[0]._id,
        date: new Date(),
        time: "14:00",
        status: "confirmed"
      }
    ];
    const insertedBookings = await Booking.insertMany(sampleBookings);
    console.log(`Inserted ${insertedBookings.length} bookings`);

    // Create some sample reviews
    const sampleReviews = [
      {
        salon_id: insertedSalons[0]._id,
        user_id: insertedUsers[0]._id,
        rating: 5,
        comment: "Amazing service!",
        created_at: new Date()
      }
    ];
    const insertedReviews = await Review.insertMany(sampleReviews);
    console.log(`Inserted ${insertedReviews.length} reviews`);

    // Create some sample payments
    const samplePayments = [
      {
        booking_id: insertedBookings[0]._id,
        amount: insertedServices[0].price,
        payment_method: "credit_card",
        status: "completed",
        created_at: new Date()
      }
    ];
    const insertedPayments = await Payment.insertMany(samplePayments);
    console.log(`Inserted ${insertedPayments.length} payments`);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 