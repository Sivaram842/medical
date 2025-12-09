// components/MedicineForm.jsx
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

const Select = (props) => (
    <select
        {...props}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
    />
);

const MedicineForm = ({ onSubmit, loading }) => {
    const [form, setForm] = useState({
        name: "",
        brand: "",
        form: "other",
        strength: "",
        genericName: "",
        price: "",
        stock: "",
    });

    const handle = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            name: form.name.trim(),
            brand: form.brand.trim() || undefined,
            form: form.form,
            strength: form.strength.trim() || undefined,
            genericName: form.genericName.trim() || undefined,
            price: Number(form.price),
            stock: Number(form.stock),
        };
        onSubmit?.(payload);
    };

    return (
        <form
            onSubmit={submit}
            className="rounded-2xl bg-white border border-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
        >
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600 text-2xl">+</span> Add Medicine
            </h2>

            <div className="mt-6 space-y-4">
                <Field label="Medicine Name *">
                    <Input
                        placeholder="e.g., Paracetamol"
                        value={form.name}
                        onChange={handle("name")}
                        required
                    />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Brand">
                        <Input placeholder="e.g., Calpol" value={form.brand} onChange={handle("brand")} />
                    </Field>
                    <Field label="Generic Name">
                        <Input placeholder="e.g., Acetaminophen" value={form.genericName} onChange={handle("genericName")} />
                    </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Form">
                        <Select value={form.form} onChange={handle("form")}>
                            <option value="tablet">Tablet</option>
                            <option value="capsule">Capsule</option>
                            <option value="syrup">Syrup</option>
                            <option value="injection">Injection</option>
                            <option value="other">Other</option>
                        </Select>
                    </Field>
                    <Field label="Strength">
                        <Input placeholder="e.g., 500mg" value={form.strength} onChange={handle("strength")} />
                    </Field>
                </div>

                {/* Inventory fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Price (₹) *">
                        <Input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handle("price")} required />
                    </Field>
                    <Field label="Stock *">
                        <Input type="number" placeholder="0" value={form.stock} onChange={handle("stock")} required />
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
