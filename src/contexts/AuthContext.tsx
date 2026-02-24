import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login } from '../services/auth.service';

export type UserRole = 'employee' | 'admin';

interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string, role: UserRole) => Promise<{ message: string; data: string }>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) { 
		throw new Error('useAuth must be used within AuthProvider'); 
	}
	return context;
};


const callLoginService = async (employeeId: string, _password: string, user: string): Promise<{ message: string; data: string }> => {
	const response = await login(employeeId, _password, user);
	return response
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('auth_token');
		const storedUser = localStorage.getItem('auth_user');
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (name: string, password: string, role: UserRole) => {

		const result = await callLoginService(name, password, role);
		setToken(result.data);
		const userData: any = { name, role };
		setUser(userData);
		localStorage.setItem('auth_token', result.data);
		localStorage.setItem('auth_user', JSON.stringify(userData));
		localStorage.setItem('auth_role', role);
		return result
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
		localStorage.removeItem('auth_role');
	}

	return (
		<AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
		{children}
		</AuthContext.Provider>
	);
}
