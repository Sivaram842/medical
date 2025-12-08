import React, { useState } from "react";

const Field = ({ label, children }) => (
    <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="mt-1">{children}</div>
    </label>
);

const Input = (props) => (
    <input
        {...props}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
    />
);

const Textarea = (props) => (
    <textarea
        {...props}
        rows={4}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
    />
);

const MedicineForm = ({ onSubmit, loading }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: parseFloat(form.price || "0"),
            stock: parseInt(form.stock || "0", 10),
        };
        onSubmit?.(payload);
    };

    return (
        <form onSubmit={submit} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600 text-2xl">+</span> Add New Medicine
            </h2>

            <div className="mt-6 space-y-4">
                <Field label="Medicine Name">
                    <Input placeholder="Enter medicine name" value={form.name} onChange={handle("name")} required />
                </Field>

                <Field label="Description">
                    <Textarea placeholder="Enter description" value={form.description} onChange={handle("description")} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Price ($)">
                        <Input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handle("price")} />
                    </Field>
                    <Field label="Stock">
                        <Input type="number" placeholder="0" value={form.stock} onChange={handle("stock")} />
                    </Field>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-3 font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
                >
                    {loading ? "Adding..." : "Add Medicine"}
                </button>
            </div>
        </form>
    );
};

export default MedicineForm;
