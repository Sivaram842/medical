// pages/PharmacyInventory.jsx (only the changed parts)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PharmacyHeader from "../components/PharmacyHeader";
import MedicineForm from "../components/MedicineForm";
import InventoryCard from "../components/InventoryCard";
import Spinner from "../components/Spinner";
import { useToast } from "../components/Toast";
import { axiosInstance } from "../lib/axios";

const PharmacyInventory = () => {
    const { id } = useParams();
    const { showToast, ToastContainer } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pharmacy, setPharmacy] = useState(null);
    const [items, setItems] = useState([]);

    const PHARMACY_URL = `/api/pharmacies/${id}`;
    const INVENTORY_URL = `/api/inventory/${id}`;
    const INVENTORY_DELETE_URL = (invId) => `/api/inventory/${id}/${invId}`;

    const load = async () => {
        try {
            const [pRes, iRes] = await Promise.all([
                axiosInstance.get(PHARMACY_URL),
                axiosInstance.get(INVENTORY_URL),
            ]);

            setPharmacy(pRes.data?.pharmacy ?? null);
            setItems(iRes.data?.items || []);
        } catch (err) {
            showToast(err.response?.data?.message || err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [id]);

    // 🟦 Two-step: create medicine → upsert inventory
    const addMedicine = async (payload) => {
        try {
            setSaving(true);

            // 1) Create medicine master
            const medRes = await axiosInstance.post("/api/medicines", {
                name: payload.name,
                brand: payload.brand,
                form: payload.form,
                strength: payload.strength,
                genericName: payload.genericName,
            });
            const medicineId = medRes.data?.medicine?._id;
            if (!medicineId) throw new Error("Failed to create medicine");

            // 2) Upsert inventory for this pharmacy
            await axiosInstance.put(INVENTORY_URL, {
                medicineId,
                price: Number(payload.price),
                stock: Number(payload.stock),
            });

            showToast("Medicine added to inventory!", "success");
            await load();
        } catch (err) {
            console.error("UPsert error:", err.response?.status, err.response?.data);
            showToast(err.response?.data?.message || err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async (item) => {
        if (!confirm(`Delete ${item?.medicine?.name || item.name}?`)) return;
        try {
            await axiosInstance.delete(INVENTORY_DELETE_URL(item._id || item.id));
            showToast("Deleted", "success");
            await load();
        } catch (err) {
            showToast(err.response?.data?.message || err.message, "error");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-[#eef2ff]">
            <ToastContainer />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <PharmacyHeader
                    name={pharmacy?.name ?? "Pharmacy"}
                    manager={pharmacy?.owner?.name}
                />

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <MedicineForm onSubmit={addMedicine} loading={saving} />
                    </div>

                    <div className="md:col-span-3">
                        <h2 className="text-xl font-bold mb-4">
                            Inventory ({items.length})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((it) => (
                                <InventoryCard
                                    key={it._id}
                                    item={{
                                        name: it?.medicine?.name || it.name,
                                        description: `${it?.medicine?.brand || ""} ${it?.medicine?.strength || ""} ${it?.medicine?.form || ""}`.trim(),
                                        price: it.price,
                                        stock: it.stock,
                                        _id: it._id,
                                    }}
                                    onEdit={() => { }}
                                    onDelete={() => deleteItem(it)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyInventory;
