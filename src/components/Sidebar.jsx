import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ClipboardList,
    Users,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    ChefHat,
    LogOut,
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Kitchen', path: '/chef', icon: ChefHat },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className={`${collapsed ? 'w-16' : 'w-64'
                } bg-gray-900 min-h-screen flex flex-col transition-all duration-300 relative flex-shrink-0`}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-gray-700">
                <div className="bg-red-500 p-2 rounded-xl flex-shrink-0">
                    <ChefHat className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <span className="ml-3 text-lg font-bold text-white">
                        Spice<span className="text-red-400">Garden</span>
                    </span>
                )}
            </div>

            {/* Toggle button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1 text-gray-400 hover:text-white transition-colors z-10"
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {!collapsed && (
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
                        Main Menu
                    </p>
                )}
                {navItems.map(({ name, path, icon: Icon }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'
                            } py-3 rounded-xl transition-all duration-200 group relative ${isActive(path)
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive(path) ? 'text-white' : ''}`} />
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">{name}</span>
                        )}
                        {/* Tooltip on collapsed */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {name}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="px-3 pb-6 border-t border-gray-700 pt-4">
                <Link
                    to="/"
                    className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'
                        } py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="ml-3 text-sm font-medium">Customer View</span>}
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
