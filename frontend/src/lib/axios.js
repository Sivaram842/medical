const API_URL = 'http://localhost:4000';

export const axiosInstance = {
    request: async (config) => {
        const token = localStorage.getItem('token');
        const headers = { ...config.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${API_URL}${config.url}`, {
                method: config.method || 'GET',
                headers: { 'Content-Type': 'application/json', ...headers },
                body: config.data ? JSON.stringify(config.data) : undefined,
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Request failed');
            return { data };
        } catch (err) {
            throw err;
        }
    },
    get: (url, config = {}) => axiosInstance.request({ ...config, url, method: 'GET' }),
    post: (url, data, config = {}) => axiosInstance.request({ ...config, url, method: 'POST', data }),
    patch: (url, data, config = {}) => axiosInstance.request({ ...config, url, method: 'PATCH', data }),
    put: (url, data, config = {}) => axiosInstance.request({ ...config, url, method: 'PUT', data }),
    delete: (url, config = {}) => axiosInstance.request({ ...config, url, method: 'DELETE' }),
};
