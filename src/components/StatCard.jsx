import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => {
    const isPositive = trend === 'up';

    return (
        <div className="card p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {subtitle && (
                        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`${color} p-3 rounded-2xl`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            {trendValue && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        {trendValue}
                    </div>
                    <span className="text-gray-400 text-xs">vs last week</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
