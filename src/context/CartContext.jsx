import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

// Helper: get the correct id from an item (handles both MongoDB _id and static id)
const getItemId = (item) => item._id || item.id;

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const addToCart = (item) => {
        const id = getItemId(item);
        setCartItems((prev) => {
            const existing = prev.find((i) => getItemId(i) === id);
            if (existing) {
                return prev.map((i) =>
                    getItemId(i) === id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((i) => getItemId(i) !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems((prev) =>
            prev.map((i) => (getItemId(i) === id ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setOrderPlaced(true);
        setTimeout(() => setOrderPlaced(false), 5000);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                orderPlaced,
                selectedTable,
                setSelectedTable,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
