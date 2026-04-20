import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getReservations, cancelReservation } from '../api/reservationApi';
import { Search, CalendarX, CheckCircle, RefreshCw, Users, AlertCircle } from 'lucide-react';

const STATUSES = ['All', 'Reserved', 'Completed', 'Cancelled'];
const STATUS_COLORS = {
    Reserved: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
};

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    const fetchReservations = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await getReservations();
            setReservations(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            await cancelReservation(id);
            setReservations((prev) => 
                prev.map((r) => r._id === id ? { ...r, status: 'Cancelled' } : r)
            );
        } catch (err) {
            alert('Failed to cancel reservation');
        }
    };

    const filtered = reservations.filter((r) => {
        const matchStatus = filter === 'All' || r.status === filter;
        const searchLower = search.toLowerCase();
        const matchSearch = r.customerName?.toLowerCase().includes(searchLower) ||
                            r.phone?.includes(searchLower) ||
                            r.tableNumber?.toLowerCase().includes(searchLower);
        return matchStatus && matchSearch;
    });

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary">Reservations</h1>
                        <p className="text-gray-500 text-sm mt-1">{reservations.length} total table bookings</p>
                    </div>
                    <button onClick={fetchReservations} className="btn-secondary flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, phone, table..."
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary w-64" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {STATUSES.map((s) => (
                            <button key={s} onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${filter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Customer</th>
                                    <th className="px-6 py-3 text-left">Date & Time</th>
                                    <th className="px-6 py-3 text-left">Details</th>
                                    <th className="px-6 py-3 text-left">Table</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            {[...Array(6)].map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length > 0 ? filtered.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-secondary flex items-center gap-2">
                                                {r.isGroupBooking && <Users className="w-4 h-4 text-purple-400"/>}
                                                {r.customerName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{r.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{r.date}</div>
                                            <div className="text-gray-500">{r.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700">{r.guests} Guests</div>
                                            {(r.occasion || r.dietaryRequirements) && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {r.occasion && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded mr-1">{r.occasion}</span>}
                                                    {r.dietaryRequirements}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-secondary">
                                            {r.tableNumber || 'Auto-assign'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.status === 'Reserved' && (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleCancel(r._id)} title="Cancel Booking" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                        <CalendarX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No reservations found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminReservations;
