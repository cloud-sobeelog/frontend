import axios from 'axios';

export const client = axios.create({
    baseURL: 'http://34.64.116.29',
    headers:{
        'content-Type': 'application/json',
    }
})