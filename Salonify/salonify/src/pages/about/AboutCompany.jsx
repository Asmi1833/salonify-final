import React from 'react';

const AboutCompany = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Company</h1>
          <p className="text-lg text-gray-600">Transforming the salon booking experience since 2020</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-10">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80" 
            alt="Salonify Headquarters" 
            className="w-full h-80 object-cover object-center"
          />
          
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">About Salonify</h2>
            <p className="text-gray-700 mb-6">
              Salonify was founded in 2020 with a clear mission: to revolutionize how people discover and book salon services. 
              What started as a small startup has grown into a leading platform connecting thousands of beauty professionals 
              with clients seeking quality salon experiences.
            </p>
            
            <p className="text-gray-700 mb-6">
              Our platform currently features over 500 partner salons across major cities, offering a wide range of services 
              from haircuts and styling to makeup, nail care, and spa treatments. With our easy-to-use booking system, 
              clients can find, compare, and reserve appointments at their convenience.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-700 mb-6">
              We envision a world where finding and booking quality beauty services is seamless and stress-free. 
              By bridging the gap between salon professionals and clients, we're creating a more connected beauty community 
              and helping salons thrive in the digital age.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8 text-center">
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-primary-600 text-4xl font-bold mb-2">500+</div>
                <div className="text-gray-700">Partner Salons</div>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-primary-600 text-4xl font-bold mb-2">50K+</div>
                <div className="text-gray-700">Monthly Bookings</div>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-primary-600 text-4xl font-bold mb-2">15+</div>
                <div className="text-gray-700">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="inline-block mr-3 bg-primary-100 text-primary-600 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                Quality First
              </h3>
              <p className="text-gray-700 ml-12">
                We partner only with salons that meet our high standards, ensuring clients receive excellent service.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="inline-block mr-3 bg-primary-100 text-primary-600 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </span>
                Transparent Communication
              </h3>
              <p className="text-gray-700 ml-12">
                We believe in honest reviews and clear service descriptions so clients know exactly what to expect.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="inline-block mr-3 bg-primary-100 text-primary-600 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Innovation
              </h3>
              <p className="text-gray-700 ml-12">
                We continuously improve our platform with new features that make booking beauty services easier.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="inline-block mr-3 bg-primary-100 text-primary-600 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </span>
                Community Support
              </h3>
              <p className="text-gray-700 ml-12">
                We empower local salon businesses and contribute to the growth of the beauty industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany; 