import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../api/menuApi';
import { Plus, Search, Edit, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';

const EMPTY_FORM = { name: '', category: 'Pizza', price: '', description: '', isVeg: true, prepTime: '20 min', isBestseller: false };
const CATEGORIES = ['Pizza', 'Burgers', 'Drinks', 'Desserts'];

const AdminMenu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchItems = async () => {
        try {
            const { data } = await getMenu();
            setItems(data.data);
        } catch { showToast('Failed to load menu', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
    const openEdit = (item) => {
        setForm({ name: item.name, category: item.category, price: item.price, description: item.description || '', isVeg: item.isVeg, prepTime: item.prepTime || '20 min', isBestseller: item.isBestseller || false });
        setEditItem(item);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) { showToast('Name and price are required', 'error'); return; }
        setSaving(true);
        try {
            if (editItem) {
                const { data } = await updateMenuItem(editItem._id, form);
                setItems((prev) => prev.map((i) => i._id === editItem._id ? data.data : i));
                showToast('Item updated');
            } else {
                const { data } = await createMenuItem(form);
                setItems((prev) => [data.data, ...prev]);
                showToast('Item added');
            }
            setShowModal(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Save failed', 'error');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteMenuItem(deleteTarget._id);
            setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
            showToast('Item deleted');
        } catch { showToast('Delete failed', 'error'); }
        finally { setDeleteTarget(null); }
    };

    const filtered = items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary">Menu Management</h1>
                        <p className="text-gray-500 text-sm mt-1">{items.length} items</p>
                    </div>
                    <button onClick={openAdd} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search menu items..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary max-w-sm" />
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm group">
                                <div className="relative h-36 bg-gray-100">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => openEdit(item)} className="p-2 bg-white rounded-lg hover:bg-blue-50 transition">
                                            <Edit className="w-4 h-4 text-blue-500" />
                                        </button>
                                        <button onClick={() => setDeleteTarget(item)} className="p-2 bg-white rounded-lg hover:bg-red-50 transition">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-secondary text-sm truncate">{item.name}</h3>
                                        <span className={`w-3 h-3 rounded-full shrink-0 ml-1 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-primary">₹{item.price}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {item.availability ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h2 className="font-bold text-secondary">{editItem ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                                    <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                                    <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Prep Time</label>
                                    <input value={form.prepTime} onChange={(e) => setForm((p) => ({ ...p, prepTime: e.target.value }))}
                                        placeholder="20 min" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                                <textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm((p) => ({ ...p, isVeg: e.target.checked }))} className="accent-green-500" />
                                    <span className="text-sm text-gray-700">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm((p) => ({ ...p, isBestseller: e.target.checked }))} className="accent-yellow-500" />
                                    <span className="text-sm text-gray-700">Bestseller</span>
                                </label>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                                    {saving ? 'Saving...' : editItem ? 'Update' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="font-bold text-secondary mb-2">Delete "{deleteTarget.name}"?</h3>
                        <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-secondary">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
