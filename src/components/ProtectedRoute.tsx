import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
	const { isAuthenticated, isLoading, user } = useAuth();
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!isAuthenticated) { 
		return <Navigate to="/login" replace />; 
	}

	if (user?.role) {
		if (!allowedRoles?.includes(user?.role)) {
			return <Navigate to={user?.role == 'admin' ? '/admin/attendance' : '/dashboard'} replace />;
		}
	}

	return <>{children}</>;
};

export default ProtectedRoute;
