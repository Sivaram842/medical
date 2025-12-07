import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post("/api/auth/signin", { email, password });
            localStorage.setItem("token", data.token);
            setToken(data.token);
            const me = await api.get("/api/auth/me");
            localStorage.setItem("user", JSON.stringify(me.data.user));
            setUser(me.data.user);
        } finally { setLoading(false); }
    };

    const signup = async (payload) => {
        setLoading(true);
        try {
            const { data } = await api.post("/api/auth/signup", payload);
            localStorage.setItem("token", data.token);
            setToken(data.token);
            const me = await api.get("/api/auth/me");
            localStorage.setItem("user", JSON.stringify(me.data.user));
            setUser(me.data.user);
        } finally { setLoading(false); }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); setToken(null);
    };

    const value = { user, token, loading, login, signup, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
