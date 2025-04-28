const { MongoClient } = require('mongodb');

// MongoDB connection string - adjust if needed
const uri = 'mongodb://localhost:27017/salonify';

// Function to seed the database
async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get the database instance
    const db = client.db();
    
    // Delete existing data
    await db.collection('users').deleteMany({});
    await db.collection('salons').deleteMany({});
    await db.collection('staff').deleteMany({});
    await db.collection('services').deleteMany({});
    await db.collection('appointments').deleteMany({});
    await db.collection('payments').deleteMany({});
    await db.collection('reviews').deleteMany({});
    console.log('Cleared existing data');
    
    // Insert Users
    const users = [
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
    ];
    
    const userResult = await db.collection('users').insertMany(users);
    console.log(`Inserted ${userResult.insertedCount} users`);
    
    // Get the salon owner user ID
    const ownerUserId = userResult.insertedIds[1]; // The second user is the salon owner
    
    // Insert Salons
    const salons = [
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
        owner_id: ownerUserId,
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
        owner_id: ownerUserId,
        images: [
          'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1546383144-fee77f4a0da0?ixlib=rb-4.0.3'
        ],
        rating: 4.7,
        numReviews: 0,
        created_at: new Date()
      }
    ];
    
    const salonResult = await db.collection('salons').insertMany(salons);
    console.log(`Inserted ${salonResult.insertedCount} salons`);
    
    // Get salon IDs
    const salonIds = Object.values(salonResult.insertedIds);
    
    // Insert Staff
    const staff = [
      {
        name: 'Ananya Patel',
        phone: '+91 9876543230',
        email: 'ananya@glamoursalon.com',
        role: 'Hairdresser',
        bio: 'Ananya is an expert stylist with over 7 years of experience specializing in hair coloring and modern cuts.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3',
        specialties: ['Hair Coloring', 'Styling', 'Haircuts'],
        salon_id: salonIds[0],
        salon_name: 'Glamour Salon',
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
        salon_id: salonIds[0],
        salon_name: 'Glamour Salon',
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
        salon_id: salonIds[1],
        salon_name: 'Urban Cuts',
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
        salon_id: salonIds[1],
        salon_name: 'Urban Cuts',
        rating: 4.7,
        created_at: new Date()
      }
    ];
    
    const staffResult = await db.collection('staff').insertMany(staff);
    console.log(`Inserted ${staffResult.insertedCount} staff members`);
    
    // Get staff IDs
    const staffIds = Object.values(staffResult.insertedIds);
    
    // Insert Services
    const serviceTemplates = [
      {
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling service with our experienced stylists.',
        price: 800,
        duration: 60,
        category: 'Hair',
        image: 'https://images.unsplash.com/photo-1595944024804-5f64103fb0c1?ixlib=rb-4.0.3',
        isPopular: true
      },
      {
        name: 'Hair Coloring',
        description: 'Full hair coloring service using premium products for vibrant, long-lasting color.',
        price: 1800,
        duration: 120,
        category: 'Hair',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3',
        isPopular: true
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Complete nail care package including manicure and pedicure.',
        price: 1200,
        duration: 90,
        category: 'Nail',
        image: 'https://images.unsplash.com/photo-1610992235683-e39ada262e80?ixlib=rb-4.0.3',
        isPopular: true
      },
      {
        name: 'Facial Treatment',
        description: 'Revitalizing facial treatment to cleanse and rejuvenate your skin.',
        price: 1500,
        duration: 60,
        category: 'Facial',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3',
        isPopular: true
      },
      {
        name: 'Full Body Massage',
        description: 'Relaxing full body massage to release tension and promote wellness.',
        price: 2000,
        duration: 90,
        category: 'Massage',
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3',
        isPopular: false
      },
      {
        name: 'Bridal Makeup',
        description: 'Complete bridal makeup package for your special day.',
        price: 5000,
        duration: 120,
        category: 'Makeup',
        image: 'https://images.unsplash.com/photo-1597225638203-fe96ab679cc3?ixlib=rb-4.0.3',
        isPopular: false
      }
    ];
    
    // Create services for each salon with slight price variations
    const services = [];
    
    for (let i = 0; i < salonIds.length; i++) {
      const salonId = salonIds[i];
      const salonName = salons[i].name;
      
      serviceTemplates.forEach(template => {
        // Add 10% price increase for each salon
        const price = template.price * (1 + i * 0.1);
        
        services.push({
          ...template,
          salon_id: salonId,
          salon_name: salonName,
          price: price,
          created_at: new Date()
        });
      });
    }
    
    const serviceResult = await db.collection('services').insertMany(services);
    console.log(`Inserted ${serviceResult.insertedCount} services`);
    
    // Get client user IDs
    const clientIds = [userResult.insertedIds[2], userResult.insertedIds[3], userResult.insertedIds[4]];
    
    // Get service IDs
    const serviceIds = Object.values(serviceResult.insertedIds);
    
    // Create Appointments
    const appointments = [];
    const statuses = ['Pending', 'Confirmed', 'Completed', 'Canceled'];
    
    // Generate dates for the next 30 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    // Generate appointments for each salon
    salonIds.forEach((salonId, salonIndex) => {
      const salonName = salons[salonIndex].name;
      
      // Get services for this salon
      const salonServices = services.filter(service => service.salon_id.toString() === salonId.toString());
      
      // Get staff for this salon
      const salonStaff = staff.filter(member => member.salon_id.toString() === salonId.toString());
      
      // Create 5 appointments per salon
      for (let i = 0; i < 5; i++) {
        // Random client, service, staff, date
        const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
        const service = salonServices[Math.floor(Math.random() * salonServices.length)];
        const staffMember = salonStaff[Math.floor(Math.random() * salonStaff.length)];
        const date = dates[Math.floor(Math.random() * dates.length)];
        
        // Random time between 9am and 6pm
        const hour = 9 + Math.floor(Math.random() * 9);
        const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        
        date.setHours(hour, minute, 0);
        
        // Calculate end time
        const endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + service.duration);
        
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = endDate.getHours();
        const endMinute = endDate.getMinutes();
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Random status
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Find client name
        const clientName = users.find(user => user._id === clientId)?.name || 'Client';
        
        appointments.push({
          client_id: clientId,
          salon_id: salonId,
          service_id: service._id,
          staff_id: staffMember._id,
          appointment_date: date,
          start_time: startTime,
          end_time: endTime,
          status,
          client_name: clientName,
          salon_name: salonName,
          service_name: service.name,
          staff_name: staffMember.name,
          price: service.price,
          notes: `Appointment for ${service.name}`,
          created_at: new Date()
        });
      }
    });
    
    const appointmentResult = await db.collection('appointments').insertMany(appointments);
    console.log(`Inserted ${appointmentResult.insertedCount} appointments`);
    
    // Create payments for completed appointments
    const completedAppointments = appointments.filter(appt => appt.status === 'Completed');
    const payments = [];
    
    completedAppointments.forEach(appointment => {
      const paymentMethods = ['Cash', 'CreditCard', 'PayPal'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      payments.push({
        appointment_id: appointment._id,
        client_id: appointment.client_id,
        salon_id: appointment.salon_id,
        service_id: appointment.service_id,
        amount: appointment.price,
        payment_method: paymentMethod,
        status: 'Paid',
        transaction_id: `TXN${Math.floor(Math.random() * 1000000)}`,
        payment_date: appointment.appointment_date,
        client_name: appointment.client_name,
        salon_name: appointment.salon_name,
        service_name: appointment.service_name,
        created_at: new Date()
      });
    });
    
    if (payments.length > 0) {
      const paymentResult = await db.collection('payments').insertMany(payments);
      console.log(`Inserted ${paymentResult.insertedCount} payments`);
    }
    
    // Create reviews for completed appointments
    const reviews = [];
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
    
    completedAppointments.forEach(appointment => {
      // Only create reviews for 80% of completed appointments
      if (Math.random() < 0.8) {
        // Random rating between 3 and 5
        const rating = 3 + Math.floor(Math.random() * 3);
        
        // Choose review text based on rating
        let reviewText;
        if (rating >= 4) {
          reviewText = positiveReviews[Math.floor(Math.random() * positiveReviews.length)];
        } else {
          reviewText = averageReviews[Math.floor(Math.random() * averageReviews.length)];
        }
        
        // Create review 1 day after appointment
        const reviewDate = new Date(appointment.appointment_date);
        reviewDate.setDate(reviewDate.getDate() + 1);
        
        reviews.push({
          client_id: appointment.client_id,
          salon_id: appointment.salon_id,
          staff_id: appointment.staff_id,
          service_id: appointment.service_id,
          appointment_id: appointment._id,
          rating,
          comments: reviewText,
          client_name: appointment.client_name,
          salon_name: appointment.salon_name,
          service_name: appointment.service_name,
          created_at: reviewDate
        });
      }
    });
    
    if (reviews.length > 0) {
      const reviewResult = await db.collection('reviews').insertMany(reviews);
      console.log(`Inserted ${reviewResult.insertedCount} reviews`);
    }
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeder
seedDatabase(); 