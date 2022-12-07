import axios from "axios";

// const BASE_URL = 'https://algophant-wallet.herokuapp.com/api/v1/';
const BASE_URL = 'http://localhost:8000/api/v1/';

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:100000,
    headers:{
        'Content-Type': 'application/json',
        accept: 'application/json',
    },

});

export default axiosInstance