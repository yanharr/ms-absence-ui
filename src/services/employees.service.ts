import axios from 'axios';

const API_URL = import.meta.env.VITE_MAIN_SERVICE || 'http://localhost:3000';

export const getEmployees = async (search?: string, page: number = 1, limit: number = 10) => {
    try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_URL}/employees`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    search,
                    page,
                    limit,
                }
            }    
        );
        return response.data;
    } catch (error) {
        console.log('Login error:', error);
        throw error;
    }
}

export const createEmployee = async (body: any) => {
    try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
            `${API_URL}/employees`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response
    } catch (error) {
        console.log('Create error:', error)
        throw error
    }
}

export const updateEmployee = async (body: any, id: string) => {
    try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.put(
            `${API_URL}/employees/${id}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response
    } catch (error) {
        console.log('Create error:', error)
        throw error
    }
}

export const deleteEmployee = async (id: string) => {
    try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(
            `${API_URL}/employees/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response
    } catch (error) {
        console.log('Create error:', error)
        throw error
    }
}