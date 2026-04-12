import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import { getMenu } from '../api/menuApi';
import { Search, ChevronDown } from 'lucide-react';

const categories = ['All', 'Pizza', 'Burgers', 'Drinks', 'Desserts'];

const Menu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    // Pick up search query from URL (from Navbar search)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('search');
        if (q) setSearchQuery(q);
    }, [location.search]);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            setError('');
            try {
                const params = {};
                if (selectedCategory !== 'All') params.category = selectedCategory;
                const { data } = await getMenu(params);
                setItems(data.data);
            } catch (err) {
                setError('Failed to load menu. Is the backend running?');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [selectedCategory]);

    const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary to-gray-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Our Menu</h1>
                    <p className="text-gray-300">Fresh ingredients, bold flavours</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search + Category bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search dishes..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                        />
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-primary text-white shadow'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                {!loading && !error && (
                    <p className="text-sm text-gray-500 mb-5">
                        {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
                    </p>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-500 text-lg">{error}</p>
                        <p className="text-gray-400 text-sm mt-2">Make sure the backend is running on port 5000.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && (
                    <>
                        {filtered.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filtered.map((item) => (
                                    <MenuCard key={item._id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-400 text-lg">No items match your search.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="mt-3 text-primary hover:underline text-sm"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Menu;
