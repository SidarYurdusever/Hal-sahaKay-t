import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  return currentUser ? children : <Navigate to="/login" />;
}
