import axios from 'axios'
import Cookies from 'js-cookie'

export default function api() {
    const api = axios.create({
        baseURL: 'https://notes-api.dicoding.dev/v1',
		headers: {
			'Content-Type': 'application/json',
		},
    })

    api.interceptors.request.use(
        config => {
            const token = Cookies.get('token')
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        error => Promise.reject(error)
    )

    api.interceptors.response.use(
        response => response, 
        error => {
            if (error.response && error.response.status === 401) {
                window.location.href = '/login'
            }
            Cookies.remove('token')
            return Promise.reject(error)
        }
    )

    return api
}