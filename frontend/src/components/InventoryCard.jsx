import React from "react";
import { PenLine, Trash2 } from "lucide-react";

const Stat = ({ label, value, colorClass }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className={`font-semibold ${colorClass}`}>{value}</span>
        <span className="text-gray-500">{label}</span>
    </div>
);

const InventoryCard = ({ item, onEdit, onDelete }) => {
    return (
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    {item.description && <p className="mt-1 text-gray-600">{item.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit?.(item)}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        aria-label="Edit"
                    >
                        <PenLine className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete?.(item)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        aria-label="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
                <Stat label="price" value={`$ ${Number(item.price || 0).toFixed(2)}`} colorClass="text-emerald-600" />
                <Stat label="units" value={`${item.stock ?? 0} units`} colorClass="text-sky-600" />
            </div>
        </div>
    );
};

export default InventoryCard;
