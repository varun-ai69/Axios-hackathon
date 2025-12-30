// src/components/Auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Shared/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute:', { user, allowedRole, userRole: user?.role });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Authenticating..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    console.log('🚫 Role mismatch:', user.role, '!==', allowedRole);
    return <Navigate to={user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  console.log('✅ Access granted to:', user.role);
  return children;
};

export default ProtectedRoute;
