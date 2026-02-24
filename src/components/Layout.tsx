import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, ClipboardList, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const Navbar = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
    { label: 'Employees', path: '/admin/employees', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
        <aside className="hidden md:flex w-64 flex-col bg-white text-gray-700 border-r border-gray-200">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
            <span className="font-semibold text-lg text-gray-900">WFH Attendance</span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        location.pathname === item.path
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-100 text-gray-700'
                    )}
                    >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </button>
            ))}
            </nav>

            <div className="px-3 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>

        <div className="flex flex-1 flex-col">
            <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <span className="font-semibold text-gray-900">WFH Attendance</span>
                <div className="flex items-center gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                            'rounded-lg p-2 transition-colors',
                            location.pathname === item.path
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-blue-100'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                        </button>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="rounded-lg p-2 text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
    </div>
  );
};

export default Navbar;