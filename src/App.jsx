import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Reservation from './pages/Reservation';
import Loyalty from './pages/Loyalty';
import TableSelection from './pages/TableSelection';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import Analytics from './pages/Analytics';
import ChefDashboard from './pages/ChefDashboard';

// Layout wrapper for customer portal (with Navbar)
const CustomerLayout = ({ children }) => (
    <>
        <Navbar />
        {children}
    </>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        {/* Auth Routes (no Navbar) */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Customer Portal */}
                        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                        <Route path="/select-table" element={<CustomerLayout><TableSelection /></CustomerLayout>} />
                        <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
                        <Route path="/order" element={<CustomerLayout><Order /></CustomerLayout>} />
                        <Route path="/reservation" element={<CustomerLayout><Reservation /></CustomerLayout>} />
                        <Route path="/loyalty" element={<CustomerLayout><Loyalty /></CustomerLayout>} />

                        {/* Admin Portal (Sidebar is inside each admin page) */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/menu" element={<AdminMenu />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/customers" element={<AdminCustomers />} />
                        <Route path="/admin/analytics" element={<Analytics />} />
                        <Route path="/chef" element={<ChefDashboard />} />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
