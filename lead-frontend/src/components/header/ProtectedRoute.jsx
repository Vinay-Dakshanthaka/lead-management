import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn, passwordUpdated }) => {
  if (!isLoggedIn) {
    // Redirect to sign-in if not logged in
    return <Navigate to="/sign-in" />;
  }

  if (!passwordUpdated) {
    // Redirect to update password if password is not updated
    return <Navigate to="/update-password" />;
  }

  // If logged in and password updated, render the children
  return children;
};

export default ProtectedRoute;
