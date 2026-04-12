import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Bell,
    Search,
    X,
    ChefHat,
    LogIn,
    LogOut,
    User,
    LayoutDashboard,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearch(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/menu', label: 'Menu' },
        { path: '/reservation', label: 'Reserve' },
        { path: '/loyalty', label: 'Loyalty' },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-secondary">Spice Garden</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-600 hover:text-primary font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        {showSearch ? (
                            <form onSubmit={handleSearch} className="flex items-center">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search dishes..."
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary w-44"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSearch(false)}
                                    className="ml-1 p-1.5 text-gray-500 hover:text-primary"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        )}

                        {/* Cart */}
                        <Link to="/order" className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Bell */}
                        <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition">
                            <Bell className="w-5 h-5" />
                        </button>

                        {/* Auth */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="hidden md:flex items-center gap-1.5 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[80px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-red-500 transition"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 bg-primary text-white text-sm px-4 py-2 rounded-xl hover:bg-red-600 transition font-medium"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 text-gray-500 hover:text-primary rounded-lg transition"
                        >
                            <div className="space-y-1">
                                <span className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 font-medium transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 font-medium transition"
                            >
                                Admin Panel
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
