import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getOrders, updateOrderStatus, deleteOrder } from '../api/orderApi';
import { Search, Trash2, RefreshCw, Receipt, Users, Clock, AlignLeft } from 'lucide-react';

const STATUSES = ['All', 'Pending', 'Preparing', 'Served', 'Billed', 'Cancelled'];
const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Preparing: 'bg-blue-100 text-blue-700',
    Served: 'bg-green-100 text-green-700',
    Billed: 'bg-purple-100 text-purple-700',
    Cancelled: 'bg-red-100 text-red-600',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await getOrders();
            setOrders(data.data);
        } catch { setError('Failed to load orders'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch { alert('Failed to update status'); }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            await deleteOrder(orderId);
            setOrders((prev) => prev.filter((o) => o._id !== orderId));
        } catch { alert('Delete failed'); }
    };

    const handlePrintBill = (order) => {
        const billWindow = window.open('', '_blank');
        billWindow.document.write(`
            <html><head><title>Bill - Order #${order._id.slice(-6).toUpperCase()}</title></head>
            <body style="font-family: monospace; padding: 20px; max-width: 400px; margin: 0 auto;">
                <h2 style="text-align: center;">SPICE GARDEN</h2>
                <p style="text-align: center;">Dine-In Receipt<br/>Table: ${order.tableNumber || 'Guest'}<br/>Date: ${new Date(order.createdAt).toLocaleString()}</p>
                <hr/>
                <table style="width: 100%; text-align: left; margin: 20px 0;">
                    <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                    ${order.items.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>₹${i.price * i.quantity}</td></tr>`).join('')}
                </table>
                <hr/>
                <h3 style="text-align: right;">Total: ₹${order.totalPrice}</h3>
                <p style="text-align: center; margin-top: 30px;">Thank you for dining with us!</p>
            </body></html>
        `);
        billWindow.document.close();
        billWindow.print();
        
        if (order.status !== 'Billed') {
            handleStatusChange(order._id, 'Billed');
        }
    };

    const filtered = orders.filter((o) => {
        const matchStatus = filter === 'All' || o.status === filter;
        const matchSearch = o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            o._id.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary">Orders</h1>
                        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
                    </div>
                    <button onClick={fetchOrders} className="btn-secondary flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search customer or order ID..."
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

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Order ID</th>
                                    <th className="px-6 py-3 text-left">Customer</th>
                                    <th className="px-6 py-3 text-left">Items</th>
                                    <th className="px-6 py-3 text-left">Total</th>
                                    <th className="px-6 py-3 text-left">Time</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            {[...Array(7)].map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length > 0 ? filtered.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-secondary">
                                            <div className="flex items-center gap-1">
                                                {order.isGroupBooking && <Users className="w-4 h-4 text-purple-500" title="Group Pre-Order"/>}
                                                {order.customer?.name || 'Guest'}
                                            </div>
                                            {order.isGroupBooking && (
                                                <div className="text-xs text-purple-600 mt-1 flex items-center gap-1 font-semibold">
                                                    <Clock className="w-3 h-3"/> Due: {order.deadline ? new Date(order.deadline).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'N/A'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[180px] truncate">
                                            {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                                            {order.isGroupBooking && order.suggestions && (
                                                <div className="text-xs text-gray-400 mt-1 italic truncate flex items-center gap-1" title={order.suggestions}>
                                                    <AlignLeft className="w-3 h-3 shrink-0" /> {order.suggestions}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary">
                                                    {['Pending', 'Preparing', 'Served', 'Billed', 'Cancelled'].map((s) => (
                                                        <option key={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handlePrintBill(order)} title="Generate Bill" className="p-1.5 text-gray-400 hover:text-purple-500 transition">
                                                    <Receipt className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(order._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No orders found</td>
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

export default AdminOrders;
