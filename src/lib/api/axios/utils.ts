import axios from "axios";

export function applyInterceptors(instance : ReturnType<typeof axios.create>){
    instance.interceptors.request.use(
        (config) => {
            // Read token from cookies
            if (typeof document !== 'undefined') {
                const token = getCookieValue('token') || getCookieValue('auth-token') || getCookieValue('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            // Add any response interceptors here if needed
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    
    return instance;
}

// Helper function to get cookie value by name
function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}