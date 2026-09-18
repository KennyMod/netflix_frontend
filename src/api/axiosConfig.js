import axios from 'axios';

// Baked in at build time by Create React App.
// Set REACT_APP_API_URL as a Docker build arg, not a runtime env var.
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});