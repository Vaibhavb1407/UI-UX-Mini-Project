import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { getMenu } from '../api/menuApi';

const CATEGORY_FALLBACKS = {
    Pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
    Burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    Drinks: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80',
    Desserts: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
};

const testimonials = [
    {
        name: "Aisha Khan",
        avatar: "AK",
        rating: 5,
        text: "Absolutely divine food! The Margherita Pizza is out of this world. Quick service and warm food every time!",
        color: "from-purple-400 to-pink-400",
    },
    {
        name: "Rohit Desai",
        avatar: "RD",
        rating: 5,
        text: "Best restaurant in town! The Chocolate Lava Cake is to die for. The loyalty rewards program is a great bonus!",
        color: "from-blue-400 to-cyan-400",
    },
    {
        name: "Neha Singh",
        avatar: "NS",
        rating: 4,
        text: "Amazing ambiance and even better food. The Spicy Chicken Burger is my go-to. Highly recommended!",
        color: "from-orange-400 to-red-400",
    },
];

const highlights = [
    { icon: "🛵", title: "Fast Service", desc: "30 min or your money back guarantee" },
    { icon: "🌿", title: "Fresh Ingredients", desc: "Farm-to-table produce every day" },
    { icon: "⭐", title: "5-Star Quality", desc: "Award-winning culinary excellence" },
];

const Home = () => {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        getMenu()
            .then(({ data }) => {
                const bestsellers = (data.data || []).filter((i) => i.isBestseller).slice(0, 4);
                setFeatured(bestsellers);
            })
            .catch(() => {
                // silently fail — no bestsellers shown if API is down
            });
    }, []);


    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-8xl">🍕</div>
                    <div className="absolute top-20 right-20 text-6xl">🍔</div>
                    <div className="absolute bottom-10 left-1/3 text-7xl">🍰</div>
                    <div className="absolute bottom-20 right-1/4 text-5xl">🥤</div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Now Open 🔥
                            </span>
                            <span className="text-gray-400 text-sm">Free dessert on orders above ₹1000</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                            Taste the Magic of{' '}
                            <span className="text-red-400">Spice Garden</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Authentic flavors crafted with love. From wood-fired pizzas to decadent desserts,
                            experience restaurant-quality dining served right at your table.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/menu" className="btn-primary flex items-center gap-2 text-base">
                                Order Food Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/reservation" className="btn-outline flex items-center gap-2 text-base border-white text-white hover:bg-white hover:text-gray-900">
                                Book a Table
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-8 mt-12">
                            {[
                                { value: "50K+", label: "Happy Customers" },
                                { value: "4.9★", label: "Average Rating" },
                                { value: "30min", label: "Prep Time" },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <p className="text-2xl font-bold text-red-400">{stat.value}</p>
                                    <p className="text-gray-400 text-xs">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights Section */}
            <section className="bg-red-500 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-4 text-white">
                                <span className="text-3xl">{h.icon}</span>
                                <div>
                                    <p className="font-bold">{h.title}</p>
                                    <p className="text-red-100 text-sm">{h.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured / Popular Dishes */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Our Bestsellers</h2>
                        <p className="text-gray-500 mt-1">Crowd favorites you'll love</p>
                    </div>
                    <Link
                        to="/menu"
                        className="flex items-center gap-1 text-red-500 font-semibold hover:gap-3 transition-all"
                    >
                        View Full Menu <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>

                {featured.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="card overflow-hidden animate-pulse">
                                <div className="h-44 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.map((item) => {
                            const fallback = CATEGORY_FALLBACKS[item.category] || CATEGORY_FALLBACKS.default;
                            return (
                                <div key={item._id || item.id} className="card group overflow-hidden hover:-translate-y-2 transition-all duration-300">
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={item.image || fallback}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => { e.target.onerror = null; e.target.src = fallback; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                            <h3 className="text-white font-bold text-sm leading-tight">{item.name}</h3>
                                            <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-bold">{item.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                <Clock className="w-3 h-3" />
                                                {item.prepTime}
                                            </div>
                                        </div>
                                        <Link
                                            to="/menu"
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                                        >
                                            Order Now
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Testimonials */}
            <section className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-white">What Our Customers Say</h2>
                        <p className="text-gray-400 mt-2">Real reviews from our happy customers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-gray-800 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}
                                    >
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <div className="flex gap-0.5 mt-0.5">
                                            {Array.from({ length: t.rating }).map((_, j) => (
                                                <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed italic">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                        🎉 Join Our Loyalty Program
                    </h2>
                    <p className="text-red-100 text-lg mb-6">
                        Earn points with every order and unlock exclusive rewards!
                    </p>
                    <Link to="/loyalty" className="bg-white text-red-500 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all inline-block">
                        Learn More
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
