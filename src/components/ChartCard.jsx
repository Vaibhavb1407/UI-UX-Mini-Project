import React from 'react';

const ChartCard = ({ title, subtitle, children }) => {
    return (
        <div className="card p-6">
            <div className="mb-4">
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                {subtitle && (
                    <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
                )}
            </div>
            <div>{children}</div>
        </div>
    );
};

export default ChartCard;
