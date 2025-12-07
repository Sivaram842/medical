import React, { useState } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-80">
            <X className="w-4 h-4" />
        </button>
    </div>
);

export const useToast = () => {
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    const ToastContainer = () => toast ? <Toast {...toast} onClose={() => setToast(null)} /> : null;
    return { showToast, ToastContainer };
};

export default Toast;
