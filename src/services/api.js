import axios from 'axios';

const api = axios.create({
    baseURL: 'https://real-estate-backend-9o9p.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});



export default api;
