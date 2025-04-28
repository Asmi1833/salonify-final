/**
 * Simple MongoDB Seeder Script
 * This script uses the MongoDB driver directly to populate the database with sample data
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection string - replace with your actual connection string if different
const uri = 'mongodb://localhost:27017/salonify';

// Sample data
const sampleData = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@salonify.com',
      password: 'password123',
      phone: '+91 9876543210',
      role: 'Admin',
      created_at: new Date()
    },
    {
      name: 'Salon Owner',
      email: 'owner@salonify.com',
      password: 'password123',
      phone: '+91 9876543211',
      role: 'SalonOwner',
      created_at: new Date()
    },
    {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'password123',
      phone: '+91 9876543212',
      role: 'Client',
      created_at: new Date()
    },
    {
      name: 'Rahul Singh',
      email: 'rahul@example.com',
      password: 'password123',
      phone: '+91 9876543213',
      role: 'Client',
      created_at: new Date()
    },
    {
      name: 'Neha Gupta',
      email: 'neha@example.com',
      password: 'password123',
      phone: '+91 9876543214',
      role: 'Client',
      created_at: new Date()
    }
  ],
  
  salons: [
    {
      name: 'Glamour Salon',
      description: 'A premium salon offering a range of beauty services.',
      address: '123 Beauty Avenue, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      phone: '+91 9876543220',
      email: 'contact@glamoursalon.com',
      website: 'www.glamoursalon.com',
      opening_time: '09:00',
      closing_time: '20:00',
      images: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3'
      ],
      rating: 4.5,
      numReviews: 0,
      created_at: new Date()
    },
    {
      name: 'Urban Cuts',
      description: 'Modern hair styling and treatments for everyone.',
      address: '456 Fashion Street, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      phone: '+91 9876543221',
      email: 'info@urbancuts.com',
      website: 'www.urbancuts.com',
      opening_time: '10:00',
      closing_time: '19:00',
      images: [
        'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1546383144-fee77f4a0da0?ixlib=rb-4.0.3'
      ],
      rating: 4.7,
      numReviews: 0,
      created_at: new Date()
    }
  ],
  
  staff: [
    {
      name: 'Ananya Patel',
      phone: '+91 9876543230',
      email: 'ananya@glamoursalon.com',
      role: 'Hairdresser',
      bio: 'Ananya is an expert stylist with over 7 years of experience specializing in hair coloring and modern cuts.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3',
      specialties: ['Hair Coloring', 'Styling', 'Haircuts'],
      rating: 4.8,
      created_at: new Date()
    },
    {
      name: 'Vikram Malhotra',
      phone: '+91 9876543231',
      email: 'vikram@glamoursalon.com',
      role: 'Beautician',
      bio: 'Vikram is a certified beautician with expertise in facials and skin treatments.',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3',
      specialties: ['Facials', 'Skin Care', 'Makeup'],
      rating: 4.6,
      created_at: new Date()
    },
    {
      name: 'Divya Sharma',
      phone: '+91 9876543232',
      email: 'divya@urbancuts.com',
      role: 'Hairdresser',
      bio: 'Divya specializes in bridal hairstyling and trendy cuts with 5+ years of experience.',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3',
      specialties: ['Bridal Hair', 'Modern Cuts', 'Hair Treatments'],
      rating: 4.9,
      created_at: new Date()
    },
    {
      name: 'Arjun Kapoor',
      phone: '+91 9876543233',
      email: 'arjun@urbancuts.com',
      role: 'Other',
      bio: 'Arjun is nail art specialist with an eye for detail and creative designs.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      specialties: ['Nail Art', 'Manicure', 'Pedicure'],
      rating: 4.7,
      created_at: new Date()
    }
  ],
  
  services: [
    {
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling service with our experienced stylists.',
      price: 800,
      duration: 60,
      category: 'Hair',
      image: 'https://images.unsplash.com/photo-1595944024804-5f64103fb0c1?ixlib=rb-4.0.3',
      isPopular: true,
      created_at: new Date()
    },
    {
      name: 'Hair Coloring',
      description: 'Full hair coloring service using premium products for vibrant, long-lasting color.',
      price: 1800,
      duration: 120,
      category: 'Hair',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3',
      isPopular: true,
      created_at: new Date()
    },
    {
      name: 'Manicure & Pedicure',
      description: 'Complete nail care package including manicure and pedicure.',
      price: 1200,
      duration: 90,
      category: 'Nail',
      image: 'https://images.unsplash.com/photo-1610992235683-e39ada262e80?ixlib=rb-4.0.3',
      isPopular: true,
      created_at: new Date()
    },
    {
      name: 'Facial Treatment',
      description: 'Revitalizing facial treatment to cleanse and rejuvenate your skin.',
      price: 1500,
      duration: 60,
      category: 'Facial',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3',
      isPopular: true,
      created_at: new Date()
    },
    {
      name: 'Full Body Massage',
      description: 'Relaxing full body massage to release tension and promote wellness.',
      price: 2000,
      duration: 90,
      category: 'Massage',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3',
      isPopular: false,
      created_at: new Date()
    },
    {
      name: 'Bridal Makeup',
      description: 'Complete bridal makeup package for your special day.',
      price: 5000,
      duration: 120,
      category: 'Makeup',
      image: 'https://images.unsplash.com/photo-1597225638203-fe96ab679cc3?ixlib=rb-4.0.3',
      isPopular: false,
      created_at: new Date()
    }
  ]
};

async function seedDatabase() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing collections
    await db.collection('users').deleteMany({});
    await db.collection('salons').deleteMany({});
    await db.collection('staff').deleteMany({});
    await db.collection('services').deleteMany({});
    await db.collection('appointments').deleteMany({});
    await db.collection('payments').deleteMany({});
    await db.collection('reviews').deleteMany({});
    console.log('✓ Cleared existing data');
    
    // Insert users with hashed passwords
    const hashedUsers = await Promise.all(
      sampleData.users.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    
    const userResult = await db.collection('users').insertMany(hashedUsers);
    console.log(`✓ Created ${userResult.insertedCount} users`);
    
    // Retrieve the inserted users to get their IDs
    const insertedUsers = await db.collection('users').find().toArray();
    const ownerUser = insertedUsers.find(user => user.role === 'SalonOwner');
    
    // Insert salons with owner reference
    const salonsWithOwner = sampleData.salons.map((salon, index) => ({
      ...salon,
      owner_id: ownerUser._id,
      salon_number: index + 1 // Add a salon number for reference
    }));
    
    const salonResult = await db.collection('salons').insertMany(salonsWithOwner);
    console.log(`✓ Created ${salonResult.insertedCount} salons`);
    
    // Retrieve the inserted salons to get their IDs
    const insertedSalons = await db.collection('salons').find().toArray();
    
    // Insert staff with salon references
    const staffWithRefs = [];
    
    insertedSalons.forEach((salon, index) => {
      // Assign first two staff to first salon, second two to second salon
      const startIdx = index * 2;
      const salonStaff = sampleData.staff.slice(startIdx, startIdx + 2).map(staff => ({
        ...staff,
        salon_id: salon._id,
        salon_name: salon.name
      }));
      staffWithRefs.push(...salonStaff);
    });
    
    const staffResult = await db.collection('staff').insertMany(staffWithRefs);
    console.log(`✓ Created ${staffResult.insertedCount} staff members`);
    
    // Insert services with salon references
    const servicesWithRefs = [];
    
    insertedSalons.forEach((salon, index) => {
      // Assign all services to each salon with different prices
      const salonServices = sampleData.services.map(service => ({
        ...service,
        salon_id: salon._id,
        salon_name: salon.name,
        // Vary prices slightly for each salon
        price: service.price * (1 + index * 0.1)
      }));
      servicesWithRefs.push(...salonServices);
    });
    
    const serviceResult = await db.collection('services').insertMany(servicesWithRefs);
    console.log(`✓ Created ${serviceResult.insertedCount} services`);
    
    // Create appointments
    const insertedStaff = await db.collection('staff').find().toArray();
    const insertedServices = await db.collection('services').find().toArray();
    const clientUsers = insertedUsers.filter(user => user.role === 'Client');
    
    const appointmentData = [];
    
    // Generate dates for the next 30 days
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
    
    // Create multiple appointments for each salon
    insertedSalons.forEach(salon => {
      const salonServices = insertedServices.filter(service => 
        service.salon_id.toString() === salon._id.toString()
      );
      
      const salonStaff = insertedStaff.filter(staff => 
        staff.salon_id.toString() === salon._id.toString()
      );
      
      // Generate 5 appointments per salon
      for (let i = 0; i < 5; i++) {
        const clientUser = clientUsers[Math.floor(Math.random() * clientUsers.length)];
        const service = salonServices[Math.floor(Math.random() * salonServices.length)];
        const staff = salonStaff[Math.floor(Math.random() * salonStaff.length)];
        const date = dates[Math.floor(Math.random() * dates.length)];
        
        // Generate random time between 9am and 6pm
        const hour = 9 + Math.floor(Math.random() * 9);
        const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        
        date.setHours(hour, minute, 0);
        
        // Calculate end time based on service duration
        const endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + service.duration);
        
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = endDate.getHours();
        const endMinute = endDate.getMinutes();
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Randomly choose status
        const statuses = ['Pending', 'Confirmed', 'Completed', 'Canceled'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        appointmentData.push({
          client_id: clientUser._id,
          salon_id: salon._id,
          service_id: service._id,
          staff_id: staff._id,
          appointment_date: date,
          start_time: startTime,
          end_time: endTime,
          status,
          client_name: clientUser.name,
          salon_name: salon.name,
          service_name: service.name,
          staff_name: staff.name,
          notes: `Appointment for ${service.name}`,
          created_at: new Date()
        });
      }
    });
    
    if (appointmentData.length > 0) {
      const appointmentResult = await db.collection('appointments').insertMany(appointmentData);
      console.log(`✓ Created ${appointmentResult.insertedCount} appointments`);
    }
    
    // Create payments for completed appointments
    const insertedAppointments = await db.collection('appointments').find().toArray();
    const completedAppointments = insertedAppointments.filter(
      appointment => appointment.status === 'Completed'
    );
    
    const paymentData = [];
    
    completedAppointments.forEach(appointment => {
      const service = insertedServices.find(
        service => service._id.toString() === appointment.service_id.toString()
      );
      
      const paymentMethods = ['CreditCard', 'PayPal', 'Cash'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      paymentData.push({
        appointment_id: appointment._id,
        client_id: appointment.client_id,
        amount: service.price,
        payment_method: paymentMethod,
        status: 'Paid',
        transaction_id: `TXN${Math.floor(Math.random() * 1000000)}`,
        payment_date: appointment.appointment_date,
        client_name: appointment.client_name,
        service_name: appointment.service_name,
        created_at: new Date()
      });
    });
    
    if (paymentData.length > 0) {
      const paymentResult = await db.collection('payments').insertMany(paymentData);
      console.log(`✓ Created ${paymentResult.insertedCount} payments`);
    }
    
    // Create reviews for completed appointments
    const reviewData = [];
    
    completedAppointments.forEach(appointment => {
      // Only create reviews for some appointments (80% chance)
      if (Math.random() < 0.8) {
        const rating = 3 + Math.floor(Math.random() * 3); // 3-5 star ratings
        
        reviewData.push({
          client_id: appointment.client_id,
          salon_id: appointment.salon_id,
          staff_id: appointment.staff_id,
          service_id: appointment.service_id,
          appointment_id: appointment._id,
          rating,
          comments: getRandomReview(rating),
          client_name: appointment.client_name,
          salon_name: appointment.salon_name,
          service_name: appointment.service_name,
          created_at: new Date(appointment.appointment_date.getTime() + 24 * 60 * 60 * 1000) // 1 day after appointment
        });
      }
    });
    
    if (reviewData.length > 0) {
      const reviewResult = await db.collection('reviews').insertMany(reviewData);
      console.log(`✓ Created ${reviewResult.insertedCount} reviews`);
    }
    
    // Update salon ratings based on reviews
    for (const salon of insertedSalons) {
      const salonReviews = reviewData.filter(
        review => review.salon_id.toString() === salon._id.toString()
      );
      
      if (salonReviews.length > 0) {
        const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / salonReviews.length;
        
        await db.collection('salons').updateOne(
          { _id: salon._id },
          { 
            $set: {
              rating: parseFloat(avgRating.toFixed(1)),
              numReviews: salonReviews.length
            }
          }
        );
      }
    }
    
    console.log('✓ Updated salon ratings');
    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Helper function to generate random reviews based on rating
function getRandomReview(rating) {
  const positiveReviews = [
    "Great service, very satisfied!",
    "The staff was professional and friendly.",
    "Excellent experience, will definitely return!",
    "Loved the results and the ambiance.",
    "Top-notch service and great attention to detail."
  ];
  
  const averageReviews = [
    "Good service overall, but room for improvement.",
    "Decent experience, satisfied with the results.",
    "Service was okay, staff was friendly.",
    "Not bad, would consider coming back.",
    "Reasonable quality for the price paid."
  ];
  
  if (rating >= 4) {
    return positiveReviews[Math.floor(Math.random() * positiveReviews.length)];
  } else {
    return averageReviews[Math.floor(Math.random() * averageReviews.length)];
  }
}

// Run the seeder
seedDatabase(); 