import axios from 'axios';

const API_URL = import.meta.env.VITE_AUTH_SERVICE || 'http://localhost:3001';

type LoginAdmin = {
    username: string,
    password: string,
} 

type LoginEmployee = {
    employee_id: string,
    password: string,
}

type LoginData = LoginAdmin | LoginEmployee

export const login = async (employeeId: string, password: string, user: string) => {
    try {
        const url = user == 'employee' ? 'auth/login' : 'auth/admin/login'
        
        const data: LoginData =
            user === 'admin'
                ? {
                    username: employeeId,
                    password,
                }
                : {
                    employee_id: employeeId,
                    password,
                }

        const response = await axios.post(`${API_URL}/${url}`, data);
        return response.data;
    } catch (error) {
        console.log('Login error:', error);
        throw error;
    }
}