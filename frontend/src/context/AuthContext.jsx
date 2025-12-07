import React, { createContext, useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (!token) return setLoading(false);
            try {
                const res = await axiosInstance.get('/api/auth/me');
                setUser(res.data);
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [token]);

    const login = async (email, password) => {
        const res = await axiosInstance.post('/api/auth/signin', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        const meRes = await axiosInstance.get('/api/auth/me');
        setUser(meRes.data);
    };

    const signup = async (name, email, password) => {
        const res = await axiosInstance.post('/api/auth/signup', { name, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        const meRes = await axiosInstance.get('/api/auth/me');
        setUser(meRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
