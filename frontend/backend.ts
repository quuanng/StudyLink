import axios, { AxiosInstance, AxiosError } from 'axios'

// Create an Axios instance with proper types
const backend: AxiosInstance = axios.create({
    baseURL: "https://studylink-3cg5.onrender.com/api",
    timeout: 5000,  
    withCredentials: true,  
    headers: {
        'Content-Type': 'application/json'  
    }
})

// Request interceptor
backend.interceptors.request.use(
    (req) => req,
    (err: AxiosError) => {
        // Remove stack object inside the AxiosError object to improve readability
        const { stack: _, ...restErr } = err
        console.error(restErr)  // Log error for case (3)
        return Promise.reject(restErr)
    }
)

// Response interceptor
backend.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        // Remove stack object inside the AxiosError object to improve readability
        const { stack: _, ...restErr } = err as AxiosError & { serverResponds?: boolean; requestSent?: boolean }

        // Set error flags with proper typing
        restErr.serverResponds = !!restErr.response
        restErr.requestSent = !!restErr.request

        // Log error only if it's Case (3)
        if (!restErr.serverResponds && !restErr.requestSent) {
            console.error(restErr)
        }

        return Promise.reject(restErr)
    }
)

export default backend
