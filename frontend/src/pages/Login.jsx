import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FormInput from '../components/FormInput';

const Login = () => {
    const { login } = useAuth();
    const { showToast, ToastContainer } = useToast();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.email) errs.email = 'Email required';
        if (!form.password) errs.password = 'Password required';
        if (Object.keys(errs).length) return setErrors(errs);

        setLoading(true);
        try {
            await login(form.email, form.password);
            window.location.href = '/';
        } catch (err) {
            showToast(err.message, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
            <ToastContainer />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold dark:text-white">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
                    <FormInput
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        error={errors.email}
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        error={errors.password}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don&apos;t have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
