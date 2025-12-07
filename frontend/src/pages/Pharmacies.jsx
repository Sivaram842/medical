import React, { useEffect, useState } from 'react';
import { Plus, Store } from 'lucide-react';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import CardPharmacy from '../components/CardPharmacy';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';

const Pharmacies = () => {
    const { showToast, ToastContainer } = useToast();
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '', phone: '', lat: '', lng: '',
        line1: '', city: '', state: '', pincode: ''
    });

    const fetchPharmacies = async () => {
        try {
            const res = await axiosInstance.get('/api/pharmacies/mine');
            setPharmacies(res.data);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPharmacies(); }, []);

    const createPharmacy = async () => {
        try {
            await axiosInstance.post('/api/pharmacies', {
                name: form.name,
                phone: form.phone,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                address: {
                    line1: form.line1,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode
                }
            });
            showToast('Pharmacy created!');
            setShowModal(false);
            fetchPharmacies();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <ToastContainer />
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold dark:text-white">My Pharmacies</h1>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                        <Plus className="w-5 h-5" /> Create Pharmacy
                    </button>
                </div>

                {loading && <Spinner />}

                {!loading && pharmacies.length === 0 && (
                    <div className="text-center py-20">
                        <Store className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No pharmacies yet</p>
                        <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                            Create Your First Pharmacy
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pharmacies.map(p => (
                        <Link key={p._id} to={`/pharmacies/${p._id}`}>
                            <CardPharmacy pharmacy={p} />
                        </Link>
                    ))}
                </div>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Pharmacy">
                    <div className="space-y-4">
                        <FormInput label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <FormInput label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Latitude" type="number" step="any" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} />
                            <FormInput label="Longitude" type="number" step="any" value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} />
                        </div>
                        <FormInput label="Address Line" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
                        <div className="grid grid-cols-3 gap-4">
                            <FormInput label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                            <FormInput label="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                            <FormInput label="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} />
                        </div>
                        <button onClick={createPharmacy} className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                            Create
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Pharmacies;
