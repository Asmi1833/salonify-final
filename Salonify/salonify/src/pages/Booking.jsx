import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSalonById, createBooking, createPayment } from '../services/api';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'paid', 'failed'
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        console.log('Booking: Fetching salon details for ID:', id);
        setLoading(true);
        const data = await getSalonById(id);
        console.log('Booking: Received salon data:', data);
        
        if (!data) {
          throw new Error('No salon data received');
        }
        
        setSalon(data);
        
        // Pre-select first service if available
        if (data.services && data.services.length > 0) {
          setFormData(prev => ({
            ...prev,
            service: data.services[0].name
          }));
          setSelectedService(data.services[0]);
        }
      } catch (err) {
        console.error('Booking: Error fetching salon:', err);
        setError('Failed to load salon details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalon();
    } else {
      setError('Invalid salon ID');
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update selected service when service selection changes
    if (name === 'service' && salon?.services) {
      const service = salon.services.find(s => s.name === value);
      setSelectedService(service);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Booking: Creating booking for service:', formData.service);
      
      // Create booking data with complete information
      const bookingData = {
        salon: id,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        price: selectedService?.price || 0,
        user: user?._id,  // Include user ID if available
        customer_name: user?.name || '',
        customer_email: user?.email || '',
      };

      console.log('Booking: Sending booking data:', bookingData);
      const result = await createBooking(bookingData);
      console.log('Booking: Booking created successfully:', result);
      
      // Store the created booking
      setCreatedBooking(result);
      
      // Show success message
      setSuccess(true);
      
      // Clear form
      setFormData({
        service: '',
        date: '',
        time: '',
        notes: ''
      });
    } catch (err) {
      console.error('Booking: Error creating booking:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!createdBooking) {
      setError('No booking available to process payment');
      return;
    }
    setShowPaymentForm(true);
    setError(null); // Clear any previous errors
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    setError(null);

    try {
      if (!createdBooking.service || !createdBooking.service.price) {
        throw new Error('Missing booking service information');
      }

      // Validate credit card details if using credit card
      if (paymentMethod === 'credit_card') {
        if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 13) {
          throw new Error('Please enter a valid card number.');
        }
        if (!cardDetails.cardName) {
          throw new Error('Please enter the cardholder name.');
        }
        if (!cardDetails.expiryDate || !cardDetails.expiryDate.includes('/')) {
          throw new Error('Please enter a valid expiry date (MM/YY).');
        }
        if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
          throw new Error('Please enter a valid CVV.');
        }
      }

      const paymentData = {
        booking_id: createdBooking._id,
        amount: createdBooking.service.price,
        service_name: createdBooking.service.name,
        payment_method: paymentMethod,
        salon_id: createdBooking.salon._id,
        salon_name: createdBooking.salon.name,
        card_details: paymentMethod === 'credit_card' ? {
          last_four: cardDetails.cardNumber.slice(-4)
        } : null
      };

      const result = await createPayment(paymentData);
      
      // Only set payment status to paid after successful payment
      if (result && result.status === 'success') {
        setPaymentStatus('paid');
        createdBooking.payment_status = 'paid';
        createdBooking.isPaid = true;

        // Show success message and redirect after a delay
        setTimeout(() => {
          navigate('/bookings', { 
            state: { 
              bookingSuccess: true,
              paymentSuccess: true 
            } 
          });
        }, 1500);
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('Payment failed: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !salon && !createdBooking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => navigate('/salons')} 
            className="mt-4"
          >
            Browse Salons
          </Button>
        </div>
      </div>
    );
  }

  if (!salon && !createdBooking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600">Salon not found</p>
          <Button 
            onClick={() => navigate('/salons')} 
            className="mt-4"
          >
            Browse Salons
          </Button>
        </div>
      </div>
    );
  }

  // If a booking has been created, show the payment screen
  if (createdBooking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Booking</h1>
            
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600">Booking created successfully! Please complete the payment to confirm your appointment.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Salon</p>
                  <p className="font-medium">{createdBooking.salon.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Service</p>
                  <p className="font-medium">{createdBooking.service.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="font-medium">{new Date(createdBooking.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p className="font-medium">{createdBooking.time}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-indigo-600">${createdBooking.service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!showPaymentForm ? (
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/bookings')}
                    disabled={processingPayment}
                  >
                    Skip Payment
                  </Button>
                  
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                      Pay Now (${createdBooking.service.price.toFixed(2)})
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className={`border rounded-lg p-4 flex items-center cursor-pointer ${paymentMethod === 'credit_card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={handlePaymentMethodChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 mr-2"
                      />
                      <div className="flex items-center">
                        <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        <span>Credit Card</span>
                      </div>
                    </label>
                    
                    <label className={`border rounded-lg p-4 flex items-center cursor-pointer ${paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={handlePaymentMethodChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 mr-2"
                      />
                      <div className="flex items-center">
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.64.64 0 0 1 .632-.537h6.921c2.334 0 3.995.519 4.935 1.536.88.95 1.155 2.261.82 3.906 0 .032-.004.059-.004.086v.343c-.005.13-.01.259-.02.386-.175 2.055-.864 3.709-2.064 4.921-1.175 1.184-2.942 1.782-5.255 1.782h-.004l-.34.003H8.261a.64.64 0 0 0-.633.543l-.552 5.3zM10.072 7.12H8.033l-.633 6.389h1.273c.419 0 .797-.016 1.124-.046.35-.033.662-.094.932-.185.373-.125.681-.296.932-.514.276-.239.49-.526.638-.866.16-.36.273-.79.337-1.29.035-.267.053-.502.061-.704.008-.205.008-.393.004-.559-.054-1.153-.414-1.946-1.07-2.363-.652-.414-1.566-.622-2.715-.622H10.1c-.004 0-.016-.004-.028-.004V7.12zm7.942-.112c-.034-.015-.071-.023-.107-.03-.035 0-.075-.009-.115-.009h-2.362l-.152 1.582c.058.004.115 0 .169 0h.193c.488 0 .882.052 1.187.16.325.112.55.288.675.529.121.243.163.539.13.886a3.2 3.2 0 0 1-.13.751c-.102.325-.241.563-.421.722-.173.152-.443.267-.812.343-.151.03-.338.046-.561.054l.498-5.006a.8.8 0 0 0-.08-.03l-.112.048z" />
                        </svg>
                        <span>PayPal</span>
                      </div>
                    </label>
                    
                    <label className={`border rounded-lg p-4 flex items-center cursor-pointer ${paymentMethod === 'apple_pay' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="apple_pay"
                        checked={paymentMethod === 'apple_pay'}
                        onChange={handlePaymentMethodChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 mr-2"
                      />
                      <div className="flex items-center">
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.71 17.608c-.347.604-.8 1.147-1.354 1.627-.729.635-1.48.812-2.283.812-.753 0-1.464-.259-2.134-.776-.323-.247-.635-.517-.946-.823-.394-.376-.753-.74-1.16-.976-.407-.223-.894-.37-1.452-.37-.671 0-1.299.194-1.876.59-.577.389-1.068.916-1.474 1.568-.422.77-.627 1.58-.627 2.417 0 .86.228 1.695.685 2.494.456.8 1.066 1.434 1.846 1.919.743.436 1.57.653 2.484.653.764 0 1.417-.134 1.952-.4.536-.277.982-.599 1.34-.97.37-.383.7-.788.977-1.218.265-.04.676-.093 1.225-.158l.047-.007a.125.125 0 0 0 .117-.125v-.6a.125.125 0 0 0-.117-.124l-.047-.007c-.536-.065-.94-.118-1.219-.158a8.684 8.684 0 0 1-.983-1.218c-.366-.389-.771-.718-1.222-.98a3.46 3.46 0 0 0-1.524-.387c-.476 0-.917.088-1.328.264-.41.177-.77.424-1.078.738a.67.67 0 0 1-.094.094c-.335.3-.627.57-.88.812a.134.134 0 0 1-.192 0 13.737 13.737 0 0 1-.88-.818c-.305-.317-.663-.559-1.066-.724a3.585 3.585 0 0 0-1.359-.246c-.57 0-1.113.123-1.628.37a3.888 3.888 0 0 0-1.342 1.044 4.82 4.82 0 0 0-.88 1.662c-.71.488-.106 1-.106 1.539 0 .576.07 1.113.212 1.61.141.5.359.95.654 1.354.293.407.671.753 1.113 1.043.465.306.983.454 1.557.454.51 0 .97-.094 1.382-.282.412-.188.753-.416 1.025-.688.27-.272.53-.6.776-.977a.125.125 0 0 1 .229.024l.04.146c.18.665.57 1.19 1.174 1.568.605.376 1.287.564 2.044.564.7 0 1.35-.17 1.94-.512.592-.341 1.084-.8 1.487-1.382.395-.611.705-1.288.927-2.025.229-.747.343-1.512.343-2.288 0-.6-.066-1.15-.196-1.651"></path>
                        </svg>
                        <span>Apple Pay</span>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                        maxLength="19"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={cardDetails.cardName}
                        onChange={handleCardInputChange}
                        placeholder="John Doe"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                          maxLength="5"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPaymentForm(false)}
                    disabled={processingPayment}
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={processingPayment}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {processingPayment ? (
                      <span className="flex items-center">
                        <Spinner size="sm" className="mr-2" />
                        Processing Payment...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        Pay ${createdBooking.service.price.toFixed(2)}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Appointment</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{salon.name}</h2>
            <p className="text-gray-600">{salon.address}</p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600">Booking created successfully!</p>
            </div>
          )}

          {selectedService && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">Price Summary</h3>
              <div className="flex justify-between">
                <span className="text-gray-600">{selectedService.name}</span>
                <span className="font-medium">${selectedService.price?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                Select Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={submitting || success}
              >
                <option value="">Choose a service</option>
                {salon.services && salon.services.length > 0 ? (
                  salon.services.map((service) => (
                    <option key={service._id || service.name} value={service.name}>
                      {service.name} - ${service.price}
                    </option>
                  ))
                ) : (
                  <option value="no-services" disabled>No services available</option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={submitting || success}
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Select Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={submitting || success}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={submitting || success}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || success}
              >
                {submitting ? 'Creating Booking...' : 'Continue to Payment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking; 