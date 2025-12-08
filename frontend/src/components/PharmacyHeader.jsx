import React from "react";
import { Package2 } from "lucide-react";

const PharmacyHeader = ({ name, manager }) => {
    return (
        <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200 p-6 md:p-8">
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white">
                    <Package2 className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{name}</h1>
                    {manager && (
                        <p className="mt-1 text-gray-600">
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
                                Managed by <span className="font-medium">{manager}</span>
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PharmacyHeader;
