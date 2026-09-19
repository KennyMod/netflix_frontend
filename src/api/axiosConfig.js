import axios from 'axios';

// Relative base URL. In production, nginx proxies /api to the backend
// container, so the browser never makes a cross-origin request.
// In development, CRA's proxy setting (package.json) does the same job.
const baseURL = process.env.REACT_APP_API_URL || '';

export default axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});