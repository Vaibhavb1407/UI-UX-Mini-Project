import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';
import { createOrder } from '../api/orderApi';
import {
    ShoppingBag,
    Tag,
    CheckCircle,
    Star,
    AlertCircle,
    CalendarDays,
    Clock,
    AlignLeft,
} from 'lucide-react';

const TAX_RATE = 0.05;
const COUPONS = { SPICE10: 0.1, WELCOME20: 0.2 };

const Order = () => {
    const { cartItems, cartTotal, clearCart, selectedTable } = useCart();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrder, setPlacedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const [isGroupBooking, setIsGroupBooking] = useState(false);
    const [groupDate, setGroupDate] = useState('');
    const [groupTime, setGroupTime] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [groupError, setGroupError] = useState('');

    const timeSlots = ['12:00 PM', '1:00 PM', '2:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

    const discount = appliedCoupon ? cartTotal * COUPONS[appliedCoupon] : 0;
    const tax = (cartTotal - discount) * TAX_RATE;
    const grandTotal = cartTotal - discount + tax;

    const applyCoupon = () => {
        setCouponError('');
        const code = couponInput.trim().toUpperCase();
        if (!COUPONS[code]) {
            setCouponError('Invalid coupon code');
            return;
        }
        setAppliedCoupon(code);
        setCouponInput('');
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (isGroupBooking) {
            if (!groupDate || !groupTime) {
                setGroupError('Please select both date and time for your group booking.');
                return;
            }
        }
        setGroupError('');

        setLoading(true);
        setApiError('');
        try {
            let deadline = null;
            if (isGroupBooking && groupDate && groupTime) {
                deadline = new Date(`${groupDate} ${groupTime}`);
            }

            const payload = {
                items: cartItems.map((item) => ({
                    menuId: item.id || item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalPrice: parseFloat(grandTotal.toFixed(2)),
                tableNumber: selectedTable,
                isGroupBooking,
                deadline,
                suggestions
            };
            const { data } = await createOrder(payload);
            setPlacedOrder(data);
            // Update loyalty points in context
            if (data.loyaltyPointsEarned) {
                updateUser({ loyaltyPoints: (user.loyaltyPoints || 0) + data.loyaltyPointsEarned });
            }
            clearCart();
            setOrderPlaced(true);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success Screen ────────────────────────────────────
    if (orderPlaced) {
        const pts = placedOrder?.loyaltyPointsEarned || 0;
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-secondary mb-2">Order Placed! 🎉</h2>
                    <p className="text-gray-500 mb-4">
                        We are preparing your food. Please enjoy your time at Table {selectedTable || 'your table'}! Your bill will be provided when you finish.
                    </p>
                    {pts > 0 && (
                        <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">
                                You earned <strong>{pts}</strong> loyalty points!
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/menu')}
                        className="btn-primary w-full"
                    >
                        Browse More
                    </button>
                    <button
                        onClick={() => navigate('/loyalty')}
                        className="btn-secondary w-full mt-3"
                    >
                        View Loyalty Points
                    </button>
                </div>
            </div>
        );
    }

    // ── Empty Cart ─────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some delicious items from our menu!</p>
                    <button onClick={() => navigate('/menu')} className="btn-primary">
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-secondary mb-8">Your Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <OrderCard key={item.id || item._id} item={item} />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        {/* Coupon */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-primary" />
                                Coupon
                            </h3>
                            {appliedCoupon ? (
                                <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                                    <span className="text-green-700 text-sm font-medium">{appliedCoupon} applied!</span>
                                    <button
                                        onClick={() => setAppliedCoupon(null)}
                                        className="text-red-400 hover:text-red-600 text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                                            placeholder="SPICE10 or WELCOME20"
                                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        />
                                        <button onClick={applyCoupon} className="btn-primary text-sm px-4 py-2">
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                                </>
                            )}
                        </div>

                        {/* Group Booking Toggle */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input 
                                    type="checkbox" 
                                    checked={isGroupBooking}
                                    onChange={(e) => setIsGroupBooking(e.target.checked)}
                                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <span className="text-sm font-semibold text-secondary">Make this a Group Pre-Order?</span>
                            </label>

                            {isGroupBooking && (
                                <div className="space-y-4 pt-4 border-t border-gray-100 mt-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                                            <CalendarDays className="w-3 h-3" /> Date *
                                        </label>
                                        <input type="date" value={groupDate} onChange={(e) => {setGroupDate(e.target.value); setGroupError('');}}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Time Slot *
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map((t) => (
                                                <button key={t} type="button"
                                                    onClick={() => {setGroupTime(t); setGroupError('');}}
                                                    className={`py-1.5 rounded-lg text-xs font-medium border transition ${groupTime === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                                            <AlignLeft className="w-3 h-3" /> Special Instructions for Chef
                                        </label>
                                        <textarea value={suggestions} onChange={(e) => setSuggestions(e.target.value)} rows={3}
                                            placeholder="Allergies, preferences, exact timing..."
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
                                    </div>
                                    {groupError && <p className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded">{groupError}</p>}
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h3 className="font-semibold text-secondary mb-4">Price Details</h3>
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({Math.round(COUPONS[appliedCoupon] * 100)}%)</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2.5 flex justify-between font-bold text-secondary text-base">
                                    <span>Grand Total</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {apiError && (
                                <div className="flex items-center gap-2 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {apiError}
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Placing Order...
                                    </>
                                ) : user ? 'Place Order' : 'Login to Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
