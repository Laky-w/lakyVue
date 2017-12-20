import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`organization/login`, params).then(res => res.data); };

export const getMenu = params => { return axios.get(`organization/getMenu`, params).then(res => res.data); };