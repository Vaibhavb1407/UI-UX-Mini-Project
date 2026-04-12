import React from 'react';
import { ShoppingCart, Star, Leaf, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Category-based fallback images so each category shows a relevant photo
const FALLBACK_IMAGES = {
    Pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
    Burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    Drinks: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80',
    Desserts: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
};

const MenuCard = ({ item }) => {
    const { addToCart, cartItems } = useCart();

    // Support both MongoDB _id (API items) and id (static/local items)
    const itemId = item._id || item.id;
    const cartItem = cartItems.find((i) => (i._id || i.id) === itemId);

    const fallback = FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.default;

    return (
        <div className="card group overflow-hidden hover:-translate-y-1 transition-all duration-300">
            {/* Image */}
            <div className="relative overflow-hidden h-44">
                <img
                    src={item.image || fallback}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        // Use category-specific fallback so every card looks different
                        e.target.onerror = null;
                        e.target.src = fallback;
                    }}
                />
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isVeg ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> Veg
                        </span>
                    ) : (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Non-Veg
                        </span>
                    )}
                    {item.isBestseller && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" /> Bestseller
                        </span>
                    )}
                </div>
                {/* Prep time */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                    ⏱ {item.prepTime}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                    </div>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        ₹{item.price}
                    </span>

                    {cartItem ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                            ✓ Added ({cartItem.quantity})
                        </span>
                    ) : (
                        <button
                            onClick={() => addToCart({ ...item, id: itemId })}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
