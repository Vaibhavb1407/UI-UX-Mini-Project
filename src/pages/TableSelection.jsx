import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Utensils } from 'lucide-react';
import TableCard from '../components/TableCard';

const tablesData = [
    { id: 'T1', number: 'T1', floor: 'Ground', capacity: 2, status: 'Available' },
    { id: 'T2', number: 'T2', floor: 'Ground', capacity: 4, status: 'Available' },
    { id: 'T3', number: 'T3', floor: 'Ground', capacity: 2, status: 'Occupied' },
    { id: 'T4', number: 'T4', floor: 'Ground', capacity: 6, status: 'Available' },
    { id: 'T5', number: 'T5', floor: 'First', capacity: 4, status: 'Available' },
    { id: 'T6', number: 'T6', floor: 'First', capacity: 8, status: 'Occupied' },
    { id: 'T7', number: 'T7', floor: 'First', capacity: 4, status: 'Available' },
    { id: 'T8', number: 'T8', floor: 'Rooftop', capacity: 6, status: 'Available' },
];

const TableSelection = () => {
    const { setSelectedTable, selectedTable } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!selectedTable) return;
        navigate('/menu');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-r from-secondary to-gray-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
                    <p className="text-gray-300">Please select your table before browsing the menu</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="bg-red-100 p-3 rounded-xl">
                            <Utensils className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary">Choose Table</h2>
                            <p className="text-sm text-gray-500">Tap on any available table</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {tablesData.map((table) => (
                            <TableCard
                                key={table.id}
                                table={table}
                                selected={selectedTable === table.number}
                                onSelect={() => setSelectedTable(table.number)}
                            />
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={handleContinue}
                            disabled={!selectedTable}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                                selectedTable 
                                    ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95 shadow-lg' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Continue to Menu
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableSelection;
