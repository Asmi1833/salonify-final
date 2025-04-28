import React from 'react';

const Privacy = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-4">Last Updated: June 1, 2023</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Salonify ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our salon booking service.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-medium mb-2">Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>Name, email address, and contact details</li>
                <li>Billing information and payment details</li>
                <li>User preferences and booking history</li>
                <li>Profile information including profile picture</li>
                <li>Any other information you choose to provide</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
              <p>
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc pl-8">
                <li>IP address and browser type</li>
                <li>Operating system</li>
                <li>Pages you view and how you interact with our website</li>
                <li>Referring websites</li>
                <li>Time spent on our website</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-8">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing and managing your bookings</li>
                <li>Responding to your inquiries and customer service requests</li>
                <li>Sending you updates about your bookings</li>
                <li>Sending promotional communications if you have opted in</li>
                <li>Analyzing usage patterns and improving user experience</li>
                <li>Protecting against unauthorized access and fraud</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
              <p>
                We may share your information with:
              </p>
              <ul className="list-disc pl-8">
                <li>Salon partners to fulfill your booking requests</li>
                <li>Service providers who perform services on our behalf</li>
                <li>Analytics and search engine providers</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p>
                We do not sell your personal information to third parties.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-8">
                <li>Right to access the personal information we hold about you</li>
                <li>Right to request correction of inaccurate information</li>
                <li>Right to request deletion of your personal information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided at the end of this Privacy Policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <p>Email: privacy@salonify.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Salon Street, Beauty City, BC 12345</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 