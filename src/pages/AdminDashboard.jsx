import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { getDashboard } from '../api/analyticsApi';
import { getOrders } from '../api/orderApi';
import { ShoppingBag, DollarSign, Users, CalendarDays, TrendingUp } from 'lucide-react';

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Preparing: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dashRes, ordersRes] = await Promise.all([getDashboard(), getOrders()]);
                setStats(dashRes.data.data);
                setRecentOrders(ordersRes.data.data.slice(0, 6));
            } catch (err) {
                setError('Failed to load dashboard data. Make sure you are logged in as admin.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = stats
        ? [
            { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
            { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
            { title: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
            { title: 'Active Reservations', value: stats.totalReservations, icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-50' },
        ]
        : [];

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Live overview of your restaurant</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-28" />
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((card) => (
                            <StatCard key={card.title} {...card} />
                        ))}
                    </div>
                )}

                <div className="grid xl:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-semibold text-secondary">Recent Orders</h2>
                            <span className="text-xs text-gray-400">{recentOrders.length} orders</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Customer</th>
                                        <th className="px-6 py-3 text-left">Items</th>
                                        <th className="px-6 py-3 text-left">Total</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-secondary">
                                                {order.customer?.name || 'Guest'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {order.items.map((i) => i.name).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 font-medium">₹{order.totalPrice}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No orders yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Popular Dishes */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Popular Dishes
                        </h2>
                        {stats?.popularDishes?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.popularDishes.map((dish, idx) => (
                                    <div key={dish.name} className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-300 w-5">#{idx + 1}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-secondary truncate">{dish.name}</p>
                                            <p className="text-xs text-gray-400">{dish.count} sold</p>
                                        </div>
                                        <span className="text-sm font-semibold text-green-600">₹{dish.revenue?.toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-8">No order data yet</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
