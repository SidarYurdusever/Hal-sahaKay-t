import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  return currentUser ? children : <Navigate to="/login" />;
}
