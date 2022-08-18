import axios from 'axios';

let baseURL;
switch (process.env.NODE_ENV) {
  case 'development':
    baseURL = process.env.VUE_APP_API_DEV + 'v1';
    break;
  default:
    baseURL = process.env.VUE_APP_API_PROD + 'v1';
    break;
}

const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default http;
