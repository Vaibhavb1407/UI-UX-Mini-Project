import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { redeemPoints } from '../api/customerApi';
import LoyaltyCard from '../components/LoyaltyCard';
import { Star, Gift, ArrowUp, AlertCircle, CheckCircle } from 'lucide-react';

const loyaltyRewards = [
    { id: 1, title: 'Free Soft Drink', points: 300, icon: '🥤', description: 'Any cold beverage of your choice' },
    { id: 2, title: '10% Off Next Order', points: 500, icon: '🏷️', description: 'Valid on your next order' },
    { id: 3, title: 'Free Dessert', points: 750, icon: '🍰', description: 'Choose any dessert from the menu' },
    { id: 4, title: 'Free Pizza', points: 1200, icon: '🍕', description: 'Any 9-inch pizza of your choice' },
    { id: 5, title: 'Family Meal Deal', points: 2000, icon: '👨‍👩‍👧', description: 'Meal for 4 with drinks' },
    { id: 6, title: 'VIP Dining Experience', points: 5000, icon: '⭐', description: 'Private dining with chef\'s special' },
];

const tierInfo = [
    { name: 'Bronze', min: 0, max: 999, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Silver', min: 1000, max: 2499, color: 'text-gray-500', bg: 'bg-gray-100' },
    { name: 'Gold', min: 2500, max: 4999, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const getTier = (points) => tierInfo.find((t) => points >= t.min && points <= t.max) || tierInfo[0];

const Loyalty = () => {
    const { user, updateUser } = useAuth();
    const [toast, setToast] = useState(null);
    const [redeemingId, setRedeemingId] = useState(null);

    const userPoints = user?.loyaltyPoints || 0;
    const tier = getTier(userPoints);
    const nextTier = tierInfo.find((t) => t.min > userPoints);
    const progressToNext = nextTier
        ? ((userPoints - tier.min) / (nextTier.min - tier.min)) * 100
        : 100;

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRedeem = async (reward) => {
        if (!user) { showToast('Please login to redeem rewards', 'error'); return; }
        if (userPoints < reward.points) { showToast('Not enough points', 'error'); return; }
        setRedeemingId(reward.id);
        try {
            await redeemPoints(user._id, reward.points);
            updateUser({ loyaltyPoints: userPoints - reward.points });
            showToast(`${reward.icon} "${reward.title}" redeemed! Enjoy!`);
        } catch (err) {
            showToast(err.response?.data?.message || 'Redemption failed', 'error');
        } finally {
            setRedeemingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                    {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Hero */}
            <div className="bg-gradient-to-r from-secondary to-gray-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Loyalty Rewards</h1>
                    <p className="text-gray-300">Earn points with every order and redeem for rewards</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Points card */}
                <div className="bg-gradient-to-r from-primary to-rose-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-white/70 text-sm mb-1">Your Points</p>
                            <p className="text-5xl font-bold">{userPoints.toLocaleString()}</p>
                            <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-sm font-medium ${tier.bg} ${tier.color}`}>
                                <Star className="w-3.5 h-3.5" />
                                {tier.name} Member
                            </div>
                        </div>
                        {nextTier && (
                            <div className="w-full md:w-64">
                                <p className="text-white/70 text-sm mb-2">
                                    {nextTier.min - userPoints} pts to {nextTier.name}
                                </p>
                                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all"
                                        style={{ width: `${Math.min(progressToNext, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-white/60 mt-1">
                                    <span>{tier.name}</span>
                                    <span>{nextTier.name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!user && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                        <p className="text-yellow-800 text-sm">
                            <strong>Login required</strong> to view your real points and redeem rewards.
                        </p>
                    </div>
                )}

                {/* Rewards Grid */}
                <h2 className="text-2xl font-bold text-secondary mb-5 flex items-center gap-2">
                    <Gift className="w-6 h-6 text-primary" /> Available Rewards
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {loyaltyRewards.map((reward) => (
                        <LoyaltyCard
                            key={reward.id}
                            reward={reward}
                            userPoints={userPoints}
                            onRedeem={() => handleRedeem(reward)}
                            redeeming={redeemingId === reward.id}
                        />
                    ))}
                </div>

                {/* How to earn */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                        <ArrowUp className="w-5 h-5 text-green-500" /> How to Earn Points
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { emoji: '🛒', title: 'Place an Order', desc: 'Earn 1 point per ₹10 spent' },
                            { emoji: '📅', title: 'Reserve a Table', desc: '+50 bonus points per reservation' },
                            { emoji: '🎂', title: 'Birthday Bonus', desc: '+200 points on your birthday' },
                            { emoji: '👥', title: 'Refer a Friend', desc: '+100 points per successful referral' },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                <span className="text-2xl">{item.emoji}</span>
                                <div>
                                    <p className="font-semibold text-secondary text-sm">{item.title}</p>
                                    <p className="text-gray-500 text-xs">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loyalty;
