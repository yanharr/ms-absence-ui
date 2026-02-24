import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { User, Shield, Clock } from "lucide-react";
import { showToast } from "../lib/toast";

const Login = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'employee' | 'admin'>('employee');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<{ employeeId?: string; password?: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const error: { employeeId?: string; password?: string} = {}
        if (!employeeId) {
            error.employeeId = 'Employee ID is required';
        }
        if (!password) {
            error.password = 'Password is required';
        }
        setError(error);
        return Object.keys(error).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) { return; }

        setIsLoading(true);
        try {
            const response: any = await login(employeeId, password, role);
            
            if (response?.message !== 'success') {
                throw new Error(response?.message || 'Failed to login');
            }
            
            showToast.success('login success');
            navigate(role === 'admin' ? '/admin/attendance' : '/dashboard');
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">

                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary rounded-2xl p-3 mb-4 shadow-elevated">
                        <Clock className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">WFH Attendance</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track your work-from-home hours</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-elevated">

                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
                    <p className="text-sm text-muted-foreground">Choose your role and enter your credentials</p>
                </div>

                <div>
                    <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setRole('employee')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        role === 'employee'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                        }`}
                    >
                        <User className="h-4 w-4" />
                        Employee
                    </button>
                    <button
                        onClick={() => setRole('admin')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        role === 'admin'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                        }`}
                    >
                        <Shield className="h-4 w-4" />
                        Admin
                    </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                        {   role == 'employee' ? 'Employee ID' : 'Admin ID'}
                        </label>
                        <input
                            id="employeeId"
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                                error.employeeId ? 'border-destructive' : 'border-border'
                            }`}
                        />
                        {error.employeeId && <p className="text-xs text-destructive">{error.employeeId}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                                error.password ? 'border-destructive' : 'border-border'
                            }`}
                        />
                        {error.password && <p className="text-xs text-destructive">{error.password}</p>}
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={isLoading}>
                        {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Signing in...
                        </div>
                        ) : (
                        `Sign in as ${role === 'admin' ? 'Admin' : 'Employee'}`
                        )}
                    </Button>
                    </form>
                </div>
                </div>
            </div>
            </div>
        );
}

export default Login