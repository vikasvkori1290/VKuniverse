import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { admin, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return admin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
