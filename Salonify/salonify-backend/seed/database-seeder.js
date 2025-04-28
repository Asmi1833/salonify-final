const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/users');
const Salon = require('../models/salons');
const Service = require('../models/services');
const Staff = require('../models/staffs');
const Appointment = require('../models/appointments');
const Booking = require('../models/bookings');
const Payment = require('../models/payments');
const Review = require('../models/reviews');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salonify';

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@salonify.com',
    phone: '+91 9876543210',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Salon Owner',
    email: 'owner@salonify.com',
    phone: '+91 9876543211',
    password: 'password123',
    role: 'salon_owner'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543212',
    password: 'password123',
    role: 'client'
  },
  {
    name: 'Rahul Singh',
    email: 'rahul@example.com',
    phone: '+91 9876543213',
    password: 'password123',
    role: 'client'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Salon.deleteMany({});
    await Service.deleteMany({});
    await Staff.deleteMany({});
    await Appointment.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Seed Users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`Inserted ${insertedUsers.length} users`);

    // Find admin, owner and client users
    const adminUser = insertedUsers.find(user => user.role === 'admin');
    const ownerUser = insertedUsers.find(user => user.role === 'salon_owner');
    const clientUsers = insertedUsers.filter(user => user.role === 'client');

    // Seed Salons
    const salons = [
      {
        name: 'Glamour Salon',
        description: 'A premium salon offering a range of beauty services.',
        address: {
          street: '123 Beauty Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760] // Mumbai coordinates
        },
        phone: '+91 9876543220',
        email: 'contact@glamoursalon.com',
        website: 'www.glamoursalon.com',
        owner: ownerUser._id,
        images: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f'
        ],
        opening_hours: {
          monday: { open: '09:00', close: '20:00' },
          tuesday: { open: '09:00', close: '20:00' },
          wednesday: { open: '09:00', close: '20:00' },
          thursday: { open: '09:00', close: '20:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '10:00', close: '18:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        features: ['Parking', 'WiFi', 'Card Payment', 'Online Booking'],
        categories: ['Hair', 'Nails', 'Facial', 'Massage'],
        isVerified: true,
        isActive: true
      },
      {
        name: 'Urban Cuts',
        description: 'Modern hair styling and treatments for everyone.',
        address: {
          street: '456 Fashion Street',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041] // Delhi coordinates
        },
        phone: '+91 9876543221',
        email: 'info@urbancuts.com',
        website: 'www.urbancuts.com',
        owner: ownerUser._id,
        images: [
          'https://images.unsplash.com/photo-1600948836101-f9ffda59d250',
          'https://images.unsplash.com/photo-1546383144-fee77f4a0da0'
        ],
        opening_hours: {
          monday: { open: '10:00', close: '19:00' },
          tuesday: { open: '10:00', close: '19:00' },
          wednesday: { open: '10:00', close: '19:00' },
          thursday: { open: '10:00', close: '19:00' },
          friday: { open: '10:00', close: '19:00' },
          saturday: { open: '09:00', close: '20:00' },
          sunday: { open: '11:00', close: '17:00' }
        },
        features: ['WiFi', 'Card Payment', 'Online Booking', 'Wheelchair Access'],
        categories: ['Hair', 'Makeup', 'Spa'],
        isVerified: true,
        isActive: true
      }
    ];

    const insertedSalons = await Salon.insertMany(salons);
    console.log(`Inserted ${insertedSalons.length} salons`);

    // Seed Staff
    const staffMembers = [
      {
        name: 'Ananya Patel',
        email: 'ananya@glamoursalon.com',
        phone: '+91 9876543230',
        salon: insertedSalons[0]._id,
        position: 'Hairdresser',
        bio: 'Ananya is an expert stylist with over 7 years of experience specializing in hair coloring and modern cuts.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
        specialties: ['Hair Coloring', 'Styling', 'Haircuts'],
        schedule: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' }
        },
        rating: 4.8,
        numReviews: 24,
        isActive: true
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram@glamoursalon.com',
        phone: '+91 9876543231',
        salon: insertedSalons[0]._id,
        position: 'Beautician',
        bio: 'Vikram is a certified beautician with expertise in facials and skin treatments.',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
        specialties: ['Facials', 'Skin Care', 'Makeup'],
        schedule: {
          monday: { start: '12:00', end: '20:00' },
          tuesday: { start: '12:00', end: '20:00' },
          wednesday: { start: '12:00', end: '20:00' },
          thursday: { start: '12:00', end: '20:00' },
          friday: { start: '12:00', end: '20:00' }
        },
        rating: 4.6,
        numReviews: 18,
        isActive: true
      },
      {
        name: 'Divya Sharma',
        email: 'divya@urbancuts.com',
        phone: '+91 9876543232',
        salon: insertedSalons[1]._id,
        position: 'Hairdresser',
        bio: 'Divya specializes in bridal hairstyling and trendy cuts with 5+ years of experience.',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
        specialties: ['Bridal Hair', 'Modern Cuts', 'Hair Treatments'],
        schedule: {
          tuesday: { start: '10:00', end: '18:00' },
          wednesday: { start: '10:00', end: '18:00' },
          thursday: { start: '10:00', end: '18:00' },
          friday: { start: '10:00', end: '18:00' },
          saturday: { start: '09:00', end: '17:00' }
        },
        rating: 4.9,
        numReviews: 32,
        isActive: true
      },
      {
        name: 'Arjun Kapoor',
        email: 'arjun@urbancuts.com',
        phone: '+91 9876543233',
        salon: insertedSalons[1]._id,
        position: 'Nail Technician',
        bio: 'Arjun is nail art specialist with an eye for detail and creative designs.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        specialties: ['Nail Art', 'Manicure', 'Pedicure'],
        schedule: {
          wednesday: { start: '11:00', end: '19:00' },
          thursday: { start: '11:00', end: '19:00' },
          friday: { start: '11:00', end: '19:00' },
          saturday: { start: '09:00', end: '19:00' },
          sunday: { start: '11:00', end: '17:00' }
        },
        rating: 4.7,
        numReviews: 21,
        isActive: true
      }
    ];

    const insertedStaff = await Staff.insertMany(staffMembers);
    console.log(`Inserted ${insertedStaff.length} staff members`);

    // Seed Services
    const services = [
      // Services for Glamour Salon
      {
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling service with our experienced stylists.',
        salon: insertedSalons[0]._id,
        category: 'Hair',
        price: 800,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1595944024804-5f64103fb0c1',
        isPopular: true,
        isActive: true,
        staffs: [insertedStaff[0]._id],
        tags: ['Haircut', 'Styling', 'Trendy']
      },
      {
        name: 'Hair Coloring',
        description: 'Full hair coloring service using premium products for vibrant, long-lasting color.',
        salon: insertedSalons[0]._id,
        category: 'Hair',
        price: 1800,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df',
        isPopular: true,
        isActive: true,
        staffs: [insertedStaff[0]._id],
        tags: ['Color', 'Hair', 'Premium']
      },
      {
        name: 'Facial Treatment',
        description: 'Revitalizing facial treatment to cleanse and rejuvenate your skin.',
        salon: insertedSalons[0]._id,
        category: 'Facial',
        price: 1500,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
        isPopular: true,
        isActive: true,
        staffs: [insertedStaff[1]._id],
        tags: ['Facial', 'Skin', 'Rejuvenation']
      },
      // Services for Urban Cuts
      {
        name: 'Premium Haircut',
        description: 'Trendy haircut with our expert stylists including consultation and styling.',
        salon: insertedSalons[1]._id,
        category: 'Hair',
        price: 1000,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1634302086887-13b5585a8959',
        isPopular: true,
        isActive: true,
        staffs: [insertedStaff[2]._id],
        tags: ['Premium', 'Haircut', 'Styling']
      },
      {
        name: 'Bridal Makeup',
        description: 'Complete bridal makeup package for your special day.',
        salon: insertedSalons[1]._id,
        category: 'Makeup',
        price: 5000,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1597225638203-fe96ab679cc3',
        isPopular: true,
        isActive: true,
        staffs: [insertedStaff[2]._id],
        tags: ['Bridal', 'Makeup', 'Special Occasion']
      },
      {
        name: 'Gel Nail Art',
        description: 'Long-lasting gel nail polish with custom nail art designs.',
        salon: insertedSalons[1]._id,
        category: 'Nails',
        price: 1200,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1610992235683-e39ada262e80',
        isPopular: true,
        isActive: true,
        staffs: [insertedStaff[3]._id],
        tags: ['Nails', 'Art', 'Gel']
      }
    ];

    const insertedServices = await Service.insertMany(services);
    console.log(`Inserted ${insertedServices.length} services`);

    // Update staff with services
    for (const staff of insertedStaff) {
      const staffServices = insertedServices.filter(
        service => service.staffs.includes(staff._id)
      );
      
      staff.services = staffServices.map(service => service._id);
      await staff.save();
    }
    console.log('Updated staff with their services');

    // Seed Bookings and Appointments
    // Helper to generate random dates in the next 30 days
    const generateFutureDate = () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
      return futureDate;
    };

    // Generate some bookings
    const bookings = [];
    const appointments = [];
    const payments = [];
    const reviews = [];

    for (let i = 0; i < clientUsers.length; i++) {
      const client = clientUsers[i];
      
      // Create 2 bookings per client
      for (let j = 0; j < 2; j++) {
        const targetSalon = insertedSalons[Math.floor(Math.random() * insertedSalons.length)];
        const salonServices = insertedServices.filter(service => service.salon.toString() === targetSalon._id.toString());
        const targetService = salonServices[Math.floor(Math.random() * salonServices.length)];
        const targetStaff = insertedStaff.find(staff => 
          staff.salon.toString() === targetSalon._id.toString() && 
          staff.services.includes(targetService._id)
        );
        
        const bookingDate = generateFutureDate();
        const hour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
        const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // 0, 15, 30, or 45
        
        const bookingTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Calculate end time
        const endHour = Math.floor(hour + targetService.duration / 60);
        const endMinute = (minute + targetService.duration % 60) % 60;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Create booking
        const booking = new Booking({
          customer: client._id,
          customerName: client.name,
          customerEmail: client.email,
          customerPhone: client.phone,
          salon: targetSalon._id,
          salonName: targetSalon.name,
          services: [{
            service: targetService._id,
            serviceName: targetService.name,
            price: targetService.price,
            duration: targetService.duration
          }],
          staff: targetStaff._id,
          staffName: targetStaff.name,
          bookingDate: bookingDate,
          bookingTime: bookingTime,
          endTime: endTime,
          totalAmount: targetService.price,
          totalDuration: targetService.duration,
          status: ['Pending', 'Confirmed', 'Completed'][Math.floor(Math.random() * 3)],
          paymentInfo: {
            paymentMethod: ['Cash', 'Credit Card', 'UPI'][Math.floor(Math.random() * 3)],
            paymentStatus: ['Unpaid', 'Paid'][Math.floor(Math.random() * 2)]
          },
          source: 'Website'
        });
        
        // If paid, create payment
        if (booking.paymentInfo.paymentStatus === 'Paid') {
          const payment = new Payment({
            booking: booking._id,
            customer: client._id,
            customerName: client.name,
            salon: targetSalon._id,
            salonName: targetSalon.name,
            amount: booking.totalAmount,
            paymentMethod: booking.paymentInfo.paymentMethod,
            status: 'Completed',
            transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
            paymentDate: new Date(),
            taxAmount: booking.totalAmount * 0.18, // 18% tax
            paymentGateway: 'Razorpay'
          });
          
          payments.push(payment);
          
          // Update booking with payment details
          booking.paymentInfo.transactionId = payment.transactionId;
          booking.paymentInfo.paymentDate = payment.paymentDate;
          booking.paymentInfo.amountPaid = payment.amount;
        }
        
        bookings.push(booking);
        
        // Create appointment for this booking
        const appointment = new Appointment({
          customer: client._id,
          customerName: client.name,
          customerPhone: client.phone,
          salon: targetSalon._id,
          salonName: targetSalon.name,
          service: targetService._id,
          serviceName: targetService.name,
          staff: targetStaff._id,
          staffName: targetStaff.name,
          date: bookingDate,
          startTime: bookingTime,
          endTime: endTime,
          duration: targetService.duration,
          price: targetService.price,
          status: booking.status,
          paymentStatus: booking.paymentInfo.paymentStatus,
          paymentMethod: booking.paymentInfo.paymentMethod
        });
        
        appointments.push(appointment);
        
        // If status is completed, create a review
        if (booking.status === 'Completed') {
          const rating = 3 + Math.floor(Math.random() * 3); // Rating between 3-5
          const review = new Review({
            customer: client._id,
            customerName: client.name,
            salon: targetSalon._id,
            salonName: targetSalon.name,
            service: targetService._id,
            serviceName: targetService.name,
            staff: targetStaff._id,
            staffName: targetStaff.name,
            booking: booking._id,
            appointment: appointment._id,
            rating: rating,
            review: getRatingComment(rating),
            serviceCriteria: {
              cleanliness: 3 + Math.floor(Math.random() * 3),
              value: 3 + Math.floor(Math.random() * 3),
              staff: 3 + Math.floor(Math.random() * 3),
              atmosphere: 3 + Math.floor(Math.random() * 3)
            },
            status: 'Approved',
            isVerified: true
          });
          
          reviews.push(review);
        }
      }
    }

    // Save all the created documents
    const insertedBookings = await Booking.insertMany(bookings);
    console.log(`Inserted ${insertedBookings.length} bookings`);
    
    const insertedAppointments = await Appointment.insertMany(appointments);
    console.log(`Inserted ${insertedAppointments.length} appointments`);
    
    const insertedPayments = await Payment.insertMany(payments);
    console.log(`Inserted ${insertedPayments.length} payments`);
    
    const insertedReviews = await Review.insertMany(reviews);
    console.log(`Inserted ${insertedReviews.length} reviews`);

    // Update salon ratings based on reviews
    for (const salon of insertedSalons) {
      const salonReviews = insertedReviews.filter(
        review => review.salon.toString() === salon._id.toString()
      );
      
      if (salonReviews.length > 0) {
        const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / salonReviews.length;
        
        salon.rating = parseFloat(avgRating.toFixed(1));
        salon.numReviews = salonReviews.length;
        await salon.save();
      }
    }
    console.log('Updated salon ratings');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Helper function to get review comments based on rating
function getRatingComment(rating) {
  const positiveComments = [
    "Great service, very satisfied with the results!",
    "The staff was professional and friendly. Highly recommend!",
    "Excellent experience, will definitely return for more services!",
    "Loved the results and the ambiance was perfect.",
    "Top-notch service and great attention to detail."
  ];
  
  const averageComments = [
    "Good service overall, but there is room for improvement.",
    "Decent experience, satisfied with the results.",
    "Service was okay, staff was friendly but could be more attentive.",
    "Not bad, would consider coming back.",
    "Reasonable quality for the price paid."
  ];
  
  if (rating >= 4) {
    return positiveComments[Math.floor(Math.random() * positiveComments.length)];
  } else {
    return averageComments[Math.floor(Math.random() * averageComments.length)];
  }
}

// Run the seeder
seedDatabase(); 