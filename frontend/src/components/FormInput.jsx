import React from 'react';

const FormInput = ({ label, error, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
            className={`w-full px-4 py-2 rounded-xl border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
);

export default FormInput;
