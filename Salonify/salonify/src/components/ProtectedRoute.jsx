import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './UI/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: "Please log in to view this page" 
        }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute; 