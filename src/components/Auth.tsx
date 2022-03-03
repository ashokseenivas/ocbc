
import React from 'react';
import { useLocation,Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';

export function Auth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}