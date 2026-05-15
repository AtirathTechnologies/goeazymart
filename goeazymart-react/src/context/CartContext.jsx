import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Check if item already exists with same options
            const existingItemIndex = prevItems.findIndex(
                (item) => 
                    item.id === product.id && 
                    item.selectedGrade === product.selectedGrade && 
                    item.selectedQty === product.selectedQty &&
                    item.selectedPacking === product.selectedPacking
            );

            if (existingItemIndex > -1) {
                return prevItems.map((item, index) => 
                    index === existingItemIndex 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId, grade, qty, packing) => {
        setCartItems((prevItems) => 
            prevItems.filter(
                (item) => 
                    !(item.id === itemId && 
                      item.selectedGrade === grade && 
                      item.selectedQty === qty &&
                      item.selectedPacking === packing)
            )
        );
    };

    const updateQuantity = (itemId, grade, qty, packing, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                (item.id === itemId && 
                 item.selectedGrade === grade && 
                 item.selectedQty === qty &&
                 item.selectedPacking === packing)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
