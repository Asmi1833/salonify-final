import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment by browsing salons, selecting a service, choosing a time slot, and confirming your booking. You'll need to be logged in to complete a booking."
    },
    {
      question: "Can I cancel my appointment?",
      answer: "Yes, you can cancel your appointment up to 24 hours before your scheduled time without any cancellation fee. To cancel, go to 'My Bookings' in your profile and select the cancel option."
    },
    {
      question: "How do I find salons near me?",
      answer: "On the Salons page, you can use the search and filter options to find salons in your area. You can filter by location, services offered, price range, and ratings."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards. Payment is processed securely at the time of booking."
    },
    {
      question: "Do I need to create an account to book?",
      answer: "Yes, you need to create an account to book appointments. This helps us provide you with a history of your bookings and personalized recommendations."
    },
    {
      question: "How do I leave a review for a salon?",
      answer: "After your appointment, you'll have the option to leave a review on the salon's page or from your booking history."
    },
    {
      question: "I'm a salon owner. How do I register my salon?",
      answer: "You can register your salon by creating an account, selecting 'Salon Owner' as your role, and completing the salon registration form with your business details."
    },
    {
      question: "What if I'm late for my appointment?",
      answer: "If you're running late, please contact the salon directly. Salon policies may vary, but many will accommodate short delays. If you're more than 15 minutes late, the salon may need to reschedule."
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-4">Still have questions?</h3>
            <p className="mb-6">If you couldn't find the answer to your question, please contact us.</p>
            <a 
              href="/contact" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 