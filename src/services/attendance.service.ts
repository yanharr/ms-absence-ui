import axios from 'axios';

const API_URL = import.meta.env.VITE_MAIN_SERVICE || 'http://localhost:3000';

export const uploadFile = async (file: File, type: string) => {
    try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData();
        formData.append('image', file)
        formData.append('type', type)
        const response = await axios.post(`${API_URL}/attendance/absence`, 
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }    
        );
        console.log(response, 'ini response')
        return response;
    } catch (error) {
        console.log('Login error:', error);
        throw error;
    }
}

export const getAttendances = async (date: string, search?:string, page?: number) => {
    try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
            `${API_URL}/admin/attendance/history`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    date,
                    search,
                    page,
                }
            }
        )
        return response.data
    } catch (error) {
        throw error;
    }
}