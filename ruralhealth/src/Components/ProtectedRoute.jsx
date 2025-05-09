import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../Firebase/firebase';

const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by looking for userType in sessionStorage
    const storedUserType = sessionStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    // Redirect to appropriate page based on user type if not authorized
    switch (userType) {
      case "Staff-Admin":
        return <Navigate to="/admin" replace />;
      case "Doctor-Physician":
        return <Navigate to="/doctor" replace />;
      case "Staff-FrontDesk":
        return <Navigate to="/front" replace />;
      case "Specialist-Dentist":
        return <Navigate to="/spec" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 