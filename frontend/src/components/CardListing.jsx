import React from 'react';

const CardListing = ({ item }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:ring-2 hover:ring-indigo-500 p-6 transition">
        <div className="flex items-start justify-between mb-3">
            <div>
                <h3 className="text-lg font-semibold dark:text-white">{item.medicine.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.medicine.brand} • {item.medicine.strength} • {item.medicine.form}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{item.price}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Stock: {item.stock}</p>
            </div>
        </div>
        <div className="flex items-center justify-between pt-3 border dark:border-gray-800">
            <div>
                <p className="text-sm font-medium dark:text-white">{item.pharmacy.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{item.pharmacy.address?.city}</p>
            </div>
            {item.distanceMeters && (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
                    {(item.distanceMeters / 1000).toFixed(1)} km
                </span>
            )}
        </div>
    </div>
);

export default CardListing;
