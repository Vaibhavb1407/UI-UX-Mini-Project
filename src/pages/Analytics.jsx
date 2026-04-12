import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getDashboard } from '../api/analyticsApi';
import ChartCard from '../components/ChartCard';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getDashboard();
                setData(res.data.data);
            } catch { setError('Failed to load analytics. Admin access required.'); }
            finally { setLoading(false); }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
                    <div className="grid lg:grid-cols-2 gap-6">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-background">
                <Sidebar />
                <main className="flex-1 p-8">
                    <p className="text-red-500">{error}</p>
                </main>
            </div>
        );
    }

    const days = data.dailyOrders.map((d) => d.day);
    const orderCounts = data.dailyOrders.map((d) => d.count);
    const revenueData = data.dailyOrders.map((d) => d.revenue);
    const dishNames = data.popularDishes.map((d) => d.name);
    const dishCounts = data.popularDishes.map((d) => d.count);

    const lineData = {
        labels: days,
        datasets: [{
            label: 'Orders',
            data: orderCounts,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
        }],
    };

    const barData = {
        labels: days,
        datasets: [{
            label: 'Revenue (₹)',
            data: revenueData,
            backgroundColor: 'rgba(239,68,68,0.8)',
            borderRadius: 8,
        }],
    };

    const pieData = {
        labels: dishNames,
        datasets: [{
            data: dishCounts,
            backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
            borderWidth: 0,
        }],
    };

    const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } };

    const summaryCards = [
        { label: 'Total Orders', value: data.totalOrders },
        { label: 'Total Revenue', value: `₹${data.totalRevenue?.toFixed(0) || 0}` },
        { label: 'Total Customers', value: data.totalCustomers },
        { label: 'Active Reservations', value: data.totalReservations },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-secondary">Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Live data from your restaurant</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {summaryCards.map((card) => (
                        <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                            <p className="text-2xl font-bold text-secondary">{card.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <ChartCard title="Orders Per Day" subtitle="Last 7 days">
                        <Line data={lineData} options={chartOptions} />
                    </ChartCard>
                    <ChartCard title="Revenue Per Day" subtitle="Last 7 days (₹)">
                        <Bar data={barData} options={chartOptions} />
                    </ChartCard>
                    {pieData.labels.length > 0 && (
                        <ChartCard title="Popular Dishes" subtitle="By number of orders">
                            <div className="h-64">
                                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                            </div>
                        </ChartCard>
                    )}

                    {/* Status breakdown */}
                    {data.statusBreakdown?.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-secondary mb-4">Order Status Breakdown</h3>
                            <div className="space-y-3">
                                {data.statusBreakdown.map((s) => {
                                    const total = data.statusBreakdown.reduce((a, b) => a + b.count, 0);
                                    const pct = total ? Math.round((s.count / total) * 100) : 0;
                                    const colors = { Pending: 'bg-yellow-400', Preparing: 'bg-blue-400', Delivered: 'bg-green-400', Cancelled: 'bg-red-400' };
                                    return (
                                        <div key={s._id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">{s._id}</span>
                                                <span className="font-medium">{s.count} ({pct}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${colors[s._id] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Analytics;
