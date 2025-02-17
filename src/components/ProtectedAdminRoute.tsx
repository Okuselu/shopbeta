import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext/authContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { state } = useAuth();
  console.log('Protected Route Auth State:', state); // Add this debug line

  if (!state.user || !state.user.roles?.includes('admin')) {
    console.log('Access denied - redirecting'); // Add this debug line
    return <Navigate to={state.user ? '/' : '/login'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;