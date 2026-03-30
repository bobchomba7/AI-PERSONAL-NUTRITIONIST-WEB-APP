import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../../context/Context';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(Context);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;