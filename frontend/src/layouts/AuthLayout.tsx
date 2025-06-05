import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthLayout: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect to home if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">EduFlix</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sua plataforma de cursos online
          </p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;