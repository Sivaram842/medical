import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PharmacyHeader from "../components/PharmacyHeader";
import MedicineForm from "../components/MedicineForm";
import InventoryCard from "../components/InventoryCard";
import Spinner from "../components/Spinner";
import { useToast } from "../components/Toast";
import { axiosInstance } from "../lib/axios";

const PharmacyInventory = () => {
    const { id } = useParams(); // /pharmacies/:id
    const { showToast, ToastContainer } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pharmacy, setPharmacy] = useState(null);
    const [items, setItems] = useState([]);

    // ---- endpoints (adjust if your API shape is different)
    const PHARMACY_URL = `/api/pharmacies/${id}`;
    const INVENTORY_LIST_URL = `/api/inventory/${id}`;                         // GET
    const INVENTORY_UPSERT_URL = `/api/inventory/${id}`;                         // PUT
    const INVENTORY_DELETE_URL = (itemId) => `/api/inventory/${id}/${itemId}`;   // DELETE

    const load = async () => {
        try {
            const [pRes, iRes] = await Promise.all([
                axiosInstance.get(PHARMACY_URL),
                axiosInstance.get(INVENTORY_LIST_URL),
            ]);

            // normalize shapes
            const p = pRes.data?.pharmacy ?? pRes.data ?? null;
            const list =
                (Array.isArray(iRes.data) ? iRes.data
                    : iRes.data?.items ?? iRes.data?.data ?? iRes.data?.inventory ?? []) || [];

            setPharmacy(p);
            setItems(list);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const addMedicine = async (payload) => {
        try {
            setSaving(true);
            await axiosInstance.post(INVENTORY_CREATE_URL, {
                pharmacyId: id,
                ...payload,
            });
            showToast("Medicine added!");
            await load();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const editItem = (item) => {
        // open modal or route to edit; left as TODO
        showToast(`Edit ${item.name} (implement modal)`);
    };

    const deleteItem = async (item) => {
        if (!confirm(`Delete ${item.name}?`)) return;
        try {
            // adjust endpoint as per your API
            await axiosInstance.delete(`/api/inventory/${item._id || item.id}`);
            showToast("Deleted");
            await load();
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-[#eef2ff]">
            <ToastContainer />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <PharmacyHeader
                    name={pharmacy?.name ?? "Pharmacy"}
                    manager={pharmacy?.manager?.name || pharmacy?.owner?.name}
                />

                {/* Content */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
                    {/* Left: Add medicine (2 columns) */}
                    <div className="md:col-span-2">
                        <MedicineForm onSubmit={addMedicine} loading={saving} />
                    </div>

                    {/* Right: Inventory (3 columns) */}
                    <div className="md:col-span-3">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">
                                Medicine Inventory ({items.length})
                            </span>
                            <span className="text-sm text-gray-600">Manage your pharmacy's medicine stock</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {items.map((it) => (
                                <InventoryCard
                                    key={it._id || it.id}
                                    item={it}
                                    onEdit={editItem}
                                    onDelete={deleteItem}
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
