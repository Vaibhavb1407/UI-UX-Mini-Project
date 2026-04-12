import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderCard = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 group">
            {/* Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop`;
                    }}
                />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                <p className="text-red-500 font-bold text-sm mt-1">₹{item.price}</p>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all active:scale-95"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-bold text-gray-900 text-sm">
                    {item.quantity}
                </span>
                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[60px]">
                <p className="font-bold text-gray-900 text-sm">₹{item.price * item.quantity}</p>
            </div>

            {/* Remove */}
            <button
                onClick={() => removeFromCart(item.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export default OrderCard;
