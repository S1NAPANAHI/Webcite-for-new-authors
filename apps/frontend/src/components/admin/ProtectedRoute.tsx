import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface ProtectedRouteProps {
  role?: string;
  privileges?: string[];
}

export default function ProtectedRoute({ role, privileges = [] }: ProtectedRouteProps) {
  const { user } = useAdminAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (privileges.length > 0) {
      const userPrivileges = user.privileges || [];
      const ok = privileges.every(p => userPrivileges.includes(p));
      if (!ok) {
        return <Navigate to="/unauthorized" replace />;
      }
  }

  return <Outlet />;
}
