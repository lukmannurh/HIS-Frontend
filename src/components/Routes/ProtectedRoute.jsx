import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  roles: null,
};

export default ProtectedRoute;
