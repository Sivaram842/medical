import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FormInput from '../components/FormInput';
import { axiosInstance } from '../lib/axios';

const Account = () => {
    const { user } = useAuth();
    const { showToast, ToastContainer } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [passwords, setPasswords] = useState({ current: '', new: '' });

    const updateName = async () => {
        try {
            await axiosInstance.patch('/api/users/me', { name });
            showToast('Name updated!');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const changePassword = async () => {
        try {
            await axiosInstance.patch('/api/users/me/password', {
                currentPassword: passwords.current,
                newPassword: passwords.new,
            });
            showToast('Password changed!');
            setPasswords({ current: '', new: '' });
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const deleteAccount = async () => {
        if (!confirm('Delete your account? This cannot be undone.')) return;
        try {
            await axiosInstance.delete('/api/users/me');
            showToast('Account deleted');
            window.location.href = '/';
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <ToastContainer />
            <div className="max-w-2xl mx-auto px-4 space-y-6">
                <h1 className="text-3xl font-bold dark:text-white">Account Settings</h1>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold dark:text-white">Profile</h2>
                    <FormInput label="Name" value={name} onChange={e => setName(e.target.value)} />
                    <FormInput label="Email" value={user?.email} disabled />
                    <button onClick={updateName} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                        Update Name
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold dark:text-white">Change Password</h2>
                    <FormInput
                        label="Current Password"
                        type="password"
                        value={passwords.current}
                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    />
                    <FormInput
                        label="New Password"
                        type="password"
                        value={passwords.new}
                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    />
                    <button onClick={changePassword} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                        Change Password
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Once you delete your account, there is no going back.</p>
                    <button onClick={deleteAccount} className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Account;
