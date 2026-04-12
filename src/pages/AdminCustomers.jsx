import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getCustomers } from '../api/customerApi';
import { Search, Users, Star, Phone, Mail } from 'lucide-react';

const TIER_STYLES = {
    Platinum: { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
    Gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' },
    Silver: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-400' },
    Bronze: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-400' },
};

const getTier = (pts) => {
    if (pts >= 5000) return 'Platinum';
    if (pts >= 2500) return 'Gold';
    if (pts >= 1000) return 'Silver';
    return 'Bronze';
};

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await getCustomers();
                setCustomers(data.data);
            } catch { setError('Failed to load customers. Admin access required.'); }
            finally { setLoading(false); }
        };
        fetchCustomers();
    }, []);

    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary">Customers</h1>
                        <p className="text-gray-500 text-sm mt-1">{customers.length} registered customers</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm px-4 py-2.5 border border-gray-100">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-secondary">{customers.length} Total</span>
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary max-w-sm w-full" />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {loading ? (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map((customer) => {
                            const tier = getTier(customer.loyaltyPoints || 0);
                            const style = TIER_STYLES[tier] || TIER_STYLES.Bronze;
                            const nextTierPts = { Bronze: 1000, Silver: 2500, Gold: 5000, Platinum: 5000 }[tier];
                            const progress = Math.min((customer.loyaltyPoints / nextTierPts) * 100, 100);

                            return (
                                <div key={customer._id} className="bg-white rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-secondary text-sm">{customer.name}</h3>
                                                <p className="text-xs text-gray-400">
                                                    Since {new Date(customer.createdAt).getFullYear()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                                            {tier}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="truncate">{customer.email}</span>
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{customer.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                            <span className="font-medium text-secondary">{customer.loyaltyPoints || 0}</span>
                                            <span>pts</span>
                                        </div>
                                    </div>

                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${style.bar}`} style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400">No customers found</div>
                )}
            </main>
        </div>
    );
};

export default AdminCustomers;
