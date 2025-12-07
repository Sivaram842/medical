import React, { useState } from 'react';
import { Search as SearchIcon, MapPin } from 'lucide-react';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import CardPharmacy from '../components/CardPharmacy';
import CardListing from '../components/CardListing';
import Pagination from '../components/Pagination';
import { axiosInstance } from '../lib/axios';

const Search = () => {
    const { showToast, ToastContainer } = useToast();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ sort: 'distance', radiusKm: 10, kind: 'all' });

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({ q: query, ...filters });
            if (location) {
                params.append('lat', location.lat);
                params.append('lng', location.lng);
            }
            const res = await axiosInstance.get(`/api/search?${params}`);
            setResults(res.data);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) return showToast('Geolocation not supported', 'error');
        navigator.geolocation.getCurrentPosition(
            pos => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                showToast('Location obtained!');
            },
            () => showToast('Could not get location', 'error')
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <ToastContainer />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold dark:text-white mb-4">Find Pharmacies & Medicines</h1>
                    <p className="text-gray-600 dark:text-gray-400">Search for medicines or pharmacies near you</p>
                </div>

                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="Search pharmacy or medicine..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={getLocation}
                            className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                            <MapPin className="w-5 h-5 dark:text-gray-300" />
                            <span className="dark:text-white">Location</span>
                        </button>
                        <button onClick={handleSearch} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-medium">
                            Search
                        </button>
                    </div>

                    {location && (
                        <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Using your location ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                        </div>
                    )}

                    <div className="mt-6 flex items-center gap-4 flex-wrap">
                        <select
                            value={filters.kind}
                            onChange={e => setFilters({ ...filters, kind: e.target.value })}
                            className="px-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white"
                        >
                            <option value="all">All Results</option>
                            <option value="pharmacy">Pharmacies Only</option>
                            <option value="medicine">Medicines Only</option>
                        </select>
                        <select
                            value={filters.sort}
                            onChange={e => setFilters({ ...filters, sort: e.target.value })}
                            className="px-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white"
                        >
                            <option value="distance">Sort by Distance</option>
                            <option value="price">Sort by Price</option>
                        </select>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={filters.radiusKm}
                            onChange={e => setFilters({ ...filters, radiusKm: parseInt(e.target.value) })}
                            className="flex-1 min-w-[200px]"
                        />
                        <span className="text-sm dark:text-gray-400">{filters.radiusKm} km radius</span>
                    </div>
                </div>

                {loading && <Spinner />}

                {results && !loading && (
                    <div className="space-y-12">
                        {results.kind === 'all' && (
                            <>
                                {results.pharmacies?.items?.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold dark:text-white mb-6">Top Pharmacies</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {results.pharmacies.items.map(p => (
                                                <CardPharmacy key={p._id} pharmacy={p} distance={p.distanceMeters} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {results.medicines?.items?.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold dark:text-white mb-6">Medicine Listings</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {results.medicines.items.map((item, i) => (
                                                <CardListing key={i} item={item} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {!results.pharmacies?.items?.length && !results.medicines?.items?.length && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">No results found. Try adjusting your search.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {results.kind !== 'all' && results.items && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.items.map((item, i) =>
                                        filters.kind === 'pharmacy' ? (
                                            <CardPharmacy key={i} pharmacy={item} distance={item.distanceMeters} />
                                        ) : (
                                            <CardListing key={i} item={item} />
                                        )
                                    )}
                                </div>
                                {results.pages > 1 && (
                                    <Pagination page={results.page} pages={results.pages} onPageChange={() => { }} />
                                )}
                            </>
                        )}
                    </div>
                )}

                {!results && !loading && (
                    <div className="text-center py-20">
                        <SearchIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Start searching to find pharmacies and medicines</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
