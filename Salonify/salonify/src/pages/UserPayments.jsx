import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserPayments } from '../services/api';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import PaymentTable from '../components/PaymentTable';
import { useAuth } from '../contexts/AuthContext';

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/payments');
      return;
    }

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await getUserPayments();
        setPayments(data);
      } catch (err) {
        setError('Failed to load your payment history. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [isAuthenticated, navigate]);

  const paidPayments = payments.filter(payment => 
    payment.status.toLowerCase() === 'paid'
  );
  
  const pendingPayments = payments.filter(payment => 
    payment.status.toLowerCase() === 'pending'
  );

  const otherPayments = payments.filter(payment => 
    !['paid', 'pending'].includes(payment.status.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Payment History</h2>
            <p className="text-gray-600 mb-6">
              You don't have any payment records yet. Book a service to get started.
            </p>
            <Link to="/salons">
              <Button variant="primary" size="lg">
                Find a Salon
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Pending Payments */}
            {pendingPayments.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Pending Payments</h2>
                <PaymentTable payments={pendingPayments} showDownload={false} />
              </div>
            )}

            {/* Paid Payments */}
            {paidPayments.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Completed Payments</h2>
                <PaymentTable payments={paidPayments} />
              </div>
            )}

            {/* Other Payments */}
            {otherPayments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Other Transactions</h2>
                <PaymentTable payments={otherPayments} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserPayments; 