import React from 'react';
import { Users } from 'lucide-react';

const TableCard = ({ table, onSelect, selected }) => {
    const isAvailable = table.status === 'Available';

    return (
        <div
            onClick={() => isAvailable && onSelect && onSelect(table)}
            className={`card p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 ${selected
                    ? 'ring-2 ring-red-500 bg-red-50'
                    : isAvailable
                        ? 'hover:shadow-xl'
                        : 'opacity-70 cursor-not-allowed'
                }`}
        >
            {/* Table Icon */}
            <div
                className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${selected
                        ? 'bg-red-500'
                        : isAvailable
                            ? 'bg-green-100'
                            : 'bg-red-100'
                    }`}
            >
                <span className="text-2xl">🪑</span>
            </div>

            {/* Table Number */}
            <h3 className="font-bold text-gray-900 text-base">{table.number}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{table.floor} Floor</p>

            {/* Capacity */}
            <div className="flex items-center justify-center gap-1 mt-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{table.capacity} guests</span>
            </div>

            {/* Status */}
            <div className="mt-3">
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${selected
                            ? 'bg-red-500 text-white'
                            : isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                >
                    {selected ? 'Selected' : table.status}
                </span>
            </div>
        </div>
    );
};

export default TableCard;
