import React from 'react';
import { Gift, Lock } from 'lucide-react';

const LoyaltyCard = ({ reward, userPoints, onRedeem }) => {
    const canRedeem = userPoints >= reward.pointsRequired;
    const progress = Math.min((userPoints / reward.pointsRequired) * 100, 100);

    return (
        <div className={`card p-5 hover:-translate-y-1 transition-all duration-300 ${canRedeem ? 'hover:shadow-2xl' : 'opacity-80'}`}>
            {/* Header Gradient */}
            <div className={`bg-gradient-to-r ${reward.color} p-4 rounded-2xl mb-4 flex justify-between items-start`}>
                <span className="text-3xl">{reward.icon}</span>
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-white text-xs font-bold">{reward.pointsRequired} pts</span>
                </div>
            </div>

            {/* Content */}
            <h3 className="font-bold text-gray-900 text-base mb-1">{reward.name}</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">{reward.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{userPoints} pts</span>
                    <span>{reward.pointsRequired} pts</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${reward.color} transition-all duration-700`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Redeem Button */}
            <button
                onClick={() => canRedeem && onRedeem(reward)}
                disabled={!canRedeem}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${canRedeem
                        ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {canRedeem ? (
                    <>
                        <Gift className="w-4 h-4" />
                        Redeem Now
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        Need {reward.pointsRequired - userPoints} more pts
                    </>
                )}
            </button>
        </div>
    );
};

export default LoyaltyCard;
