import axios from 'axios';

export const client = axios.create({
    baseURL: 'http://www.sobeelog.site',
    headers:{
        'content-Type': 'application/json',
    }
})