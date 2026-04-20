import React, { useEffect, useState } from 'react';
import { getActiveOrders, updateOrderStatus } from '../api/orderApi';
import { io } from 'socket.io-client';
import { AlertCircle, Clock, ChefHat, Check, Users, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';

// We need to determine the socket URL. When using vite proxy, we might need to connect to backend URL in dev
const SOCKET_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : window.location.origin;

const ChefDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch initial active orders
        const fetchOrders = async () => {
            try {
                const { data } = await getActiveOrders();
                setOrders(data.data);
            } catch (err) {
                setError('Failed to load active orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Connect socket
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            socket.emit('joinChefRoom');
        });

        socket.on('newOrder', (order) => {
            setOrders((prev) => [...prev, order].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        });

        socket.on('orderStatusUpdate', (updatedOrder) => {
            setOrders((prev) => {
                if (updatedOrder.status === 'Served' || updatedOrder.status === 'Billed' || updatedOrder.status === 'Cancelled') {
                    // Remove from active list
                    return prev.filter(o => o._id !== updatedOrder._id);
                } else {
                    // Update status in list or add it if preparing
                    const exists = prev.find(o => o._id === updatedOrder._id);
                    if (exists) {
                        return prev.map(o => o._id === updatedOrder._id ? updatedOrder : o);
                    } else {
                        return [...prev, updatedOrder].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    }
                }
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // We rely on socket 'orderStatusUpdate' event to refresh the UI
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <ChefHat className="w-8 h-8 text-red-500" />
                            Live Kitchen Dashboard
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Real-time view of active orders</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl p-4 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-800 rounded-2xl h-64 animate-pulse"></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                        <ChefHat className="w-20 h-20 mb-4 opacity-20" />
                        <h2 className="text-2xl font-bold">No Active Orders</h2>
                        <p>Kitchen is clear! Time to prep.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.map((order) => {
                            const isNew = order.status === 'Pending';
                            const isGroup = order.isGroupBooking;
                            
                            const borderColor = isNew 
                                ? (isGroup ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]') 
                                : 'border-blue-500/30';
                            const headerColor = isNew 
                                ? (isGroup ? 'bg-purple-500/10' : 'bg-yellow-500/10') 
                                : 'bg-blue-500/10';
                            const badgeColor = isNew 
                                ? (isGroup ? 'bg-purple-500 text-purple-900' : 'bg-yellow-500 text-yellow-900') 
                                : 'bg-blue-500 text-blue-900';

                            return (
                                <div key={order._id} className={`bg-gray-800 rounded-2xl overflow-hidden border ${borderColor}`}>
                                    {/* Header */}
                                    <div className={`p-4 flex justify-between items-center ${headerColor}`}>
                                        <div>
                                            <span className="font-bold text-lg flex items-center gap-1">
                                                {isGroup && <Users className="w-4 h-4 text-purple-400" />}
                                                Order #{order._id.slice(-4).toUpperCase()}
                                            </span>
                                            <div className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-2">
                                                <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                                                    Table: {order.tableNumber || 'Takeaway'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {isGroup && order.deadline 
                                                        ? `Due: ${new Date(order.deadline).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}`
                                                        : new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    {isGroup && order.suggestions && (
                                        <div className="px-4 pt-3 bg-gray-800/50">
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5 text-sm text-purple-200 flex gap-2">
                                                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                                                <p className="leading-relaxed">{order.suggestions}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <div className="p-4 bg-gray-800/50">
                                        <ul className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-start border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                                                    <div className="flex gap-3">
                                                        <span className="font-bold text-lg text-gray-300 w-6">{item.quantity}x</span>
                                                        <div>
                                                            <span className="font-medium text-gray-100 block">{item.name}</span>
                                                            {/* If we had item notes, they would go here */}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 border-t border-gray-700 bg-gray-800">
                                        {isNew ? (
                                            <button 
                                                onClick={() => handleStatusChange(order._id, 'Preparing')}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                                            >
                                                Start Preparing
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleStatusChange(order._id, 'Served')}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-5 h-5" />
                                                Mark Served
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChefDashboard;
