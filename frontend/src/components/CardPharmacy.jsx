import React from 'react';

const CardPharmacy = ({ pharmacy, distance }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:ring-2 hover:ring-indigo-500 p-6 transition">
        <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold dark:text-white">{pharmacy.name}</h3>
            {distance && (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
                    {(distance / 1000).toFixed(1)} km
                </span>
            )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            {pharmacy.address?.line1}, {pharmacy.address?.city}, {pharmacy.address?.state} {pharmacy.address?.pincode}
        </p>
        {pharmacy.phone && <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">📞 {pharmacy.phone}</p>}
    </div>
);

export default CardPharmacy;
