import React, { useState } from 'react';
import TableCard from '../components/TableCard';
import { createReservation } from '../api/reservationApi';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

const tablesData = [
    { id: 1, number: 'T1', floor: 'Ground', capacity: 2, status: 'Available' },
    { id: 2, number: 'T2', floor: 'Ground', capacity: 4, status: 'Available' },
    { id: 3, number: 'T3', floor: 'Ground', capacity: 2, status: 'Occupied' },
    { id: 4, number: 'T4', floor: 'Ground', capacity: 6, status: 'Available' },
    { id: 5, number: 'T5', floor: 'First', capacity: 4, status: 'Available' },
    { id: 6, number: 'T6', floor: 'First', capacity: 8, status: 'Occupied' },
    { id: 7, number: 'T7', floor: 'First', capacity: 4, status: 'Available' },
    { id: 8, number: 'T8', floor: 'Rooftop', capacity: 6, status: 'Available' },
];

const timeSlots = ['12:00 PM', '1:00 PM', '2:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

const Reservation = () => {
    const { user } = useAuth();
    const [selectedTable, setSelectedTable] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [form, setForm] = useState({
        customerName: user?.name || '',
        phone: user?.phone || '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: '',
        isGroupBooking: false,
        occasion: '',
        seatingPreference: '',
        dietaryRequirements: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.customerName.trim()) e.customerName = 'Name is required';
        if (!form.phone.trim()) e.phone = 'Phone is required';
        if (!form.date) e.date = 'Date is required';
        if (!form.time) e.time = 'Please select a time slot';
        if (!selectedTable) e.table = 'Please select a table';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        try {
            await createReservation({
                ...form,
                tableNumber: selectedTable?.number,
            });
            setConfirmed(true);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    // ── Confirmation Screen ───────────────────────────────
    if (confirmed) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-secondary mb-2">Reservation Confirmed!</h2>
                    <p className="text-gray-500 mb-2">
                        Table <strong>{selectedTable?.number}</strong> on {selectedTable?.floor} floor
                    </p>
                    <p className="text-gray-500 mb-6">
                        {form.date} at {form.time} for {form.guests} guest{form.guests > 1 ? 's' : ''}
                    </p>
                    <button onClick={() => { setConfirmed(false); setSelectedTable(null); }} className="btn-primary w-full">
                        Make Another Reservation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-r from-secondary to-gray-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Reserve a Table</h1>
                    <p className="text-gray-300">Book your spot and arrive in style</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-secondary mb-5">Booking Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input name="customerName" value={form.customerName} onChange={handleChange}
                                        className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary ${errors.customerName ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                        className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <CalendarDays className="w-3.5 h-3.5" /> Date *
                                    </label>
                                    <input type="date" name="date" value={form.date} onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary ${errors.date ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" /> Guests
                                    </label>
                                    <input type="number" name="guests" value={form.guests} onChange={handleChange}
                                        min="1" max="20"
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> Time Slot *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((t) => (
                                        <button key={t} type="button"
                                            onClick={() => { setForm((p) => ({ ...p, time: t })); setErrors((p) => ({ ...p, time: '' })); }}
                                            className={`py-2 rounded-xl text-xs font-medium border transition ${form.time === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer mb-3">
                                    <input 
                                        type="checkbox" 
                                        checked={form.isGroupBooking}
                                        onChange={(e) => setForm((prev) => ({ ...prev, isGroupBooking: e.target.checked }))}
                                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">This is a Group Booking (8+ guests)</span>
                                </label>
                            </div>

                            {form.isGroupBooking && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                                            <select name="occasion" value={form.occasion} onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                                                <option value="">Select...</option>
                                                <option value="Birthday">Birthday</option>
                                                <option value="Anniversary">Anniversary</option>
                                                <option value="Corporate">Corporate</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Seating Pref.</label>
                                            <select name="seatingPreference" value={form.seatingPreference} onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                                                <option value="">Select...</option>
                                                <option value="Indoor">Indoor</option>
                                                <option value="Outdoor">Outdoor</option>
                                                <option value="Rooftop">Rooftop</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Requirements</label>
                                        <input type="text" name="dietaryRequirements" value={form.dietaryRequirements} onChange={handleChange}
                                            placeholder="e.g. 2 Vegan, 1 Gluten-free"
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows={3}
                                    placeholder="Allergies, celebrations, accessibility needs..."
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
                            </div>

                            {errors.table && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {errors.table}
                                </p>
                            )}
                            {apiError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {apiError}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                                {loading ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Booking...</>
                                ) : 'Confirm Reservation'}
                            </button>
                        </form>
                    </div>

                    {/* Table Selection */}
                    <div>
                        <h2 className="text-xl font-bold text-secondary mb-4">Choose a Table</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {tablesData.map((table) => (
                                <TableCard
                                    key={table.id}
                                    table={table}
                                    selected={selectedTable?.id === table.id}
                                    onSelect={() => {
                                        if (table.status === 'Available') {
                                            setSelectedTable(table);
                                            setErrors((p) => ({ ...p, table: '' }));
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;
