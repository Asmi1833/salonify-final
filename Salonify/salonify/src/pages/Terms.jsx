import React from 'react';

const Terms = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-4">Last Updated: June 1, 2023</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement ("Agreement") between you and Salonify regarding your use of our website and salon booking service.
              </p>
              <p>
                By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                Salonify provides an online platform that connects users with salon service providers, allowing users to discover, book, and manage appointments for various beauty and wellness services.
              </p>
              <p>
                We do not provide salon services directly. We act as an intermediary between users and salon service providers. The salon service providers are independent businesses and are not employed by Salonify.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                To use certain features of our service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to update this information to maintain its accuracy.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. We encourage you to use a "strong" password (a password that uses a combination of upper and lower case letters, numbers, and symbols) with your account.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Booking and Cancellation</h2>
              <p>
                When you make a booking through our service, you agree to honor that booking and arrive on time. If you need to cancel or reschedule, please do so at least 24 hours in advance.
              </p>
              <p>
                Cancellation policies may vary by salon. Please review the specific cancellation policy for each salon before making a booking. Late cancellations or no-shows may result in fees as determined by the salon's policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
              <p>
                Payment for salon services may be processed through our platform. By making a payment, you authorize us to charge the payment method you provide for the amount indicated at the time of booking.
              </p>
              <p>
                We work with third-party payment processors and do not store your full payment information on our servers. All payment processing is subject to the terms and privacy policies of our payment processors.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. User Generated Content</h2>
              <p>
                Our service allows users to post reviews, comments, and other content. By posting content on our platform, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, publicly display, reproduce, and distribute such content on our service.
              </p>
              <p>
                You are solely responsible for the content you post. You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are and will remain the exclusive property of Salonify and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Salonify.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p>
                In no event shall Salonify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-8">
                <li>Your access to or use of or inability to access or use the service;</li>
                <li>Any conduct or content of any third party on the service;</li>
                <li>Any content obtained from the service; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>Email: legal@salonify.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Salon Street, Beauty City, BC 12345</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 