import axios from 'axios';

const axiosInstance = axios.create({
    //baseURL: '/api',
    baseURL: 'http://192.168.1.40:8000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
