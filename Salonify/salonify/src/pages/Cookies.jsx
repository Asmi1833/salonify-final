import React from 'react';

const Cookies = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-gray-600 mb-4">Last Updated: June 1, 2023</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Salonify ("we", "our", or "us") uses cookies and similar technologies on our website. This Cookie Policy explains how we use cookies, how they help us improve your experience, and the choices you have regarding their use.
              </p>
              <p>
                By continuing to browse or use our website, you agree to our use of cookies as described in this Cookie Policy and our Privacy Policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They allow the website to recognize your device and remember if you've been to the website before. Cookies are used to collect information about how you interact with a website, including which pages you visit and what links you click on.
              </p>
              <p>
                Cookies cannot harm your device or system, and they do not contain personally identifiable information about you. They simply help us improve your experience, remember your preferences, and enable certain features of our website.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              <p>
                We use the following types of cookies on our website:
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and form submissions. The website cannot function properly without these cookies.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Preference Cookies</h3>
              <p>
                These cookies allow our website to remember choices you have made in the past, like your language preference, location, or login information. They enhance your user experience by providing personalized features.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Marketing Cookies</h3>
              <p>
                These cookies are used to track visitors across websites. They are used to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website. These third parties may include:
              </p>
              <ul className="list-disc pl-8">
                <li>Google Analytics for website usage analysis</li>
                <li>Social media platforms for sharing content</li>
                <li>Payment processors for secure transactions</li>
                <li>Advertising partners for targeted advertising</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may impact your overall user experience. Below are links to instructions on how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-8">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                We encourage you to review this Cookie Policy periodically to stay informed about how we are using cookies.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at:
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

export default Cookies; 